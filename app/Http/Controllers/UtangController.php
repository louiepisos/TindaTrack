<?php

namespace App\Http\Controllers;

use App\Models\Utang;
use Illuminate\Http\Request;
use Inertia\Inertia;

// UtangController - nag-manage sa customer credits/installments
// "Utang" = debt/credit in Filipino
// Tracks customer balances at payment history

class UtangController extends Controller
{
    // Ipakita ang tanan utang records with customer info at items
    public function index()
    {
        // Kuhaon tanan nga utang records with items at product details
        $utangs = Utang::with('items.product')
            ->orderBy('created_at', 'desc')  // Most recent first
            ->get()
            // Transform data para sa frontend
            ->map(fn($u) => [
                'id'             => $u->id,
                'customer_name'  => $u->customer_name,
                'contact_number' => $u->contact_number,
                'total_amount'   => $u->total_amount,      // Total amount owed
                'paid_amount'    => $u->paid_amount,       // Amount already paid
                'remaining'      => $u->remaining,         // Amount still due
                'status'         => $u->status,            // unpaid, partial, or paid
                'created_at'     => $u->created_at->format('M d, Y g:i A'),
                'items'          => $u->items->map(fn($i) => [
                    'product' => $i->product->name,
                    'emoji'   => $i->product->emoji,
                    'qty'     => $i->quantity,
                    'is_tingi'=> $i->is_tingi,             // Per piece or per pack?
                    'price'   => $i->unit_price,
                    'total'   => $i->total_price,
                ]),
            ]);

        // Render ang utang page
        return Inertia::render('Utang/Index', [
            'utangs' => $utangs,
        ]);
    }

    // Record ang payment para sa utang
    public function markPaid(Request $request, Utang $utang)
    {
        // Validate ang payment amount
        $request->validate([
            'paid_amount' => 'required|numeric|min:0',
        ]);

        // Calculate ang new paid amount
        $newPaid = $utang->paid_amount + $request->paid_amount;
        // Determine status: fully paid o partial payment?
        $status  = $newPaid >= $utang->total_amount ? 'paid' : 'partial';

        // Update ang utang record
        // Limit ang paid amount to total (walay overpayment)
        $utang->update([
            'paid_amount' => min($newPaid, $utang->total_amount),
            'status'      => $status,
        ]);

        return back()->with('success', 'Payment recorded.');
    }
}
