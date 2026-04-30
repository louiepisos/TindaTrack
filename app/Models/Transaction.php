<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Transaction Model - audit log para sa lahat ng stock movements
// Track every change sa inventory - sales, restocks, adjustments, damage, returns
// Nag-store ng snapshot ng stock before at after

class Transaction extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'product_id',       // Which product
        'user_id',          // Who made the transaction
        'type',             // sale, restock, adjustment, return, damaged
        'quantity',         // Amount ng change (negative = out, positive = in)
        'stock_before',     // Snapshot ng stock quantity before this transaction
        'stock_after',      // Snapshot ng stock quantity after this transaction
        'unit_price',       // Price per unit at time ng transaction
        'total_amount',     // Quantity × unit_price
        'reference_number', // Receipt/PO/RMA number para sa reference
        'notes',            // Additional notes about transaction
        'transacted_at',    // Exact date/time ng transaction
    ];

    // Type casting
    protected $casts = [
        'quantity'      => 'integer',
        'stock_before'  => 'integer',
        'stock_after'   => 'integer',
        'unit_price'    => 'decimal:2',
        'total_amount'  => 'decimal:2',
        'transacted_at' => 'datetime',
    ];

    // ── Relationships ──

    // A transaction ay related sa specific product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // A transaction ay done by a user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
