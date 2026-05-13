<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Utang;
use App\Models\UtangItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

// SaleController - ga handle sa POS (Point of Sale) transactions
// Naga record sa sales, nag-decrement sa stock, og nag-create og utang records

class SaleController extends Controller
{
    // Ipakita ang complete sale history with revenue summaries
    public function index()
    {
        $sales = Sale::with(['items.product', 'user', 'utang'])
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'receipt_no'   => 'SALE-' . str_pad($s->id, 6, '0', STR_PAD_LEFT),
                'payment_type' => $s->payment_type,
                'total_amount' => $s->total_amount,
                'amount_given' => $s->amount_given,
                'change_amount'=> $s->change_amount,
                'customer'     => $s->utang?->customer_name ?? null,
                'cashier'      => $s->user?->name ?? 'Unknown',
                'created_at'   => $s->created_at->format('M d, Y g:i A'),
                'items_count'  => $s->items->sum('quantity'),
                'items'        => $s->items->map(fn($i) => [
                    'product'   => $i->product?->name ?? 'Deleted Product',
                    'emoji'     => $i->product?->emoji ?? '📦',
                    'quantity'  => $i->quantity,
                    'is_tingi'  => $i->is_tingi,
                    'unit_price'=> $i->unit_price,
                    'total'     => $i->total_price,
                ]),
            ]);

        // Revenue summary
        $totalRevenue = Sale::where('payment_type', 'paid')->sum('total_amount');
        $totalUtang   = Sale::where('payment_type', 'utang')->sum('total_amount');
        $todayRevenue = Sale::where('payment_type', 'paid')
            ->whereDate('created_at', today())
            ->sum('total_amount');

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'summary' => [
                'totalRevenue' => (float) $totalRevenue,
                'totalUtang'   => (float) $totalUtang,
                'todayRevenue' => (float) $todayRevenue,
                'totalSales'   => Sale::count(),
            ]
        ]);
    }

    // Store ang bag ong sale transaction
    public function store(Request $request)
    {
        $request->validate([
            'items'               => 'required|array|min:1',
            'items.*.product_id'  => 'required|exists:products,id',
            'items.*.quantity'    => 'required|integer|min:1',
            'items.*.is_tingi'    => 'boolean',
            'items.*.unit_price'  => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'total_amount'        => 'required|numeric|min:0',
            'payment_type'        => 'required|in:paid,utang',
            'amount_given'        => 'nullable|numeric|min:0',
            'customer_name'       => 'nullable|string|max:255',
            'contact_number'      => 'nullable|string|max:50',
        ]);

        // Stock check BEFORE doing anything
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product->stock_quantity < $item['quantity']) {
                return back()->withErrors([
                    'stock' => "Not enough stock for \"{$product->name}\". Only {$product->stock_quantity} left!"
                ]);
            }
        }

        DB::transaction(function () use ($request) {
            $utangId = null;

            if ($request->payment_type === 'utang') {
                $utang = Utang::create([
                    'customer_name'  => $request->customer_name ?? 'Unknown',
                    'contact_number' => $request->contact_number,
                    'total_amount'   => $request->total_amount,
                    'paid_amount'    => 0,
                    'status'         => 'unpaid',
                    'user_id'        => auth()->id(),
                ]);

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

            $sale = Sale::create([
                'user_id'       => auth()->id(),
                'total_amount'  => $request->total_amount,
                'amount_given'  => $request->amount_given ?? 0,
                'change_amount' => max(0, ($request->amount_given ?? 0) - $request->total_amount),
                'payment_type'  => $request->payment_type,
                'utang_id'      => $utangId,
            ]);

            foreach ($request->items as $item) {
                SaleItem::create([
                    'sale_id'     => $sale->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'is_tingi'    => $item['is_tingi'] ?? false,
                    'unit_price'  => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);

                Product::where('id', $item['product_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }
        });

        return back()->with('success', 'Sale recorded successfully.');
    }
}