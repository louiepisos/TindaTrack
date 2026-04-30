<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Utang;
use App\Models\UtangItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// SaleController - nag-handle ng POS (Point of Sale) transactions
// Nag-record ng sales, nag-decrement ng stock, at nag-create ng utang records

class SaleController extends Controller
{
    // Store ang bagong sale transaction
    // Pwedeng full payment o installment (utang)
    public function store(Request $request)
    {
        // Validate ang sale request data
        $request->validate([
            'items'               => 'required|array|min:1',              // At least 1 item required
            'items.*.product_id'  => 'required|exists:products,id',      // Valid product ID
            'items.*.quantity'    => 'required|integer|min:1',           // At least 1 quantity
            'items.*.is_tingi'    => 'boolean',                          // Is this tingi (per piece)?
            'items.*.unit_price'  => 'required|numeric|min:0',          // Price per unit
            'items.*.total_price' => 'required|numeric|min:0',          // Total price for item
            'total_amount'        => 'required|numeric|min:0',          // Grand total
            'payment_type'        => 'required|in:paid,utang',          // paid or utang
            'amount_given'        => 'nullable|numeric|min:0',          // Amount paid (if cash)
            'customer_name'       => 'nullable|string|max:255',         // Customer name (if utang)
            'contact_number'      => 'nullable|string|max:50',          // Customer contact (if utang)
        ]);

        // ── Stock check BEFORE doing anything ──
        // Verify na may sapat na stock bago mag-process
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product->stock_quantity < $item['quantity']) {
                // Return error kung walang enough stock
                return back()->withErrors([
                    'stock' => "Not enough stock for \"{$product->name}\". Only {$product->stock_quantity} left!"
                ]);
            }
        }

        // Gumamit ng database transaction para sa data consistency
        // Lahat ng operations here ay mag-rollback if may error
        DB::transaction(function () use ($request) {
            $utangId = null;

            // Kung utang (installment payment), create ang utang record
            if ($request->payment_type === 'utang') {
                // Create utang header record
                $utang = Utang::create([
                    'customer_name'  => $request->customer_name ?? 'Unknown',
                    'contact_number' => $request->contact_number,
                    'total_amount'   => $request->total_amount,
                    'paid_amount'    => 0,  // Initially unpaid
                    'status'         => 'unpaid',
                    'user_id'        => auth()->id(),
                ]);

                // Create utang line items
                foreach ($request->items as $item) {
                    UtangItem::create([
                        'utang_id'    => $utang->id,
                        'product_id'  => $item['product_id'],
                        'quantity'    => $item['quantity'],
                        'is_tingi'    => $item['is_tingi'] ?? false,
                        'unit_price'  => $item['unit_price'],
                        'total_price' => $item['total_price'],
                    ]);
                }

                $utangId = $utang->id;
            }

            // Create ang sale record
            $sale = Sale::create([
                'user_id'       => auth()->id(),
                'total_amount'  => $request->total_amount,
                'amount_given'  => $request->amount_given ?? 0,
                'change_amount' => max(0, ($request->amount_given ?? 0) - $request->total_amount),
                'payment_type'  => $request->payment_type,
                'utang_id'      => $utangId,  // Link to utang if applicable
            ]);

            // Create sale line items at mag-decrement ng stock
            foreach ($request->items as $item) {
                // Create sale item record
                SaleItem::create([
                    'sale_id'     => $sale->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'is_tingi'    => $item['is_tingi'] ?? false,
                    'unit_price'  => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);

                // Decrement ang product stock
                // Ito ay nag-reduce ng available inventory
                Product::where('id', $item['product_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }
        });

        return back()->with('success', 'Sale recorded successfully.');
    }
}
