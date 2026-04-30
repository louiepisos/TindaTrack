<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// SaleItem Model - individual line items sa bawat sale
// Store ang product, quantity, at pricing info para sa each item sa sale

class SaleItem extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'sale_id',     // Foreign key sa Sales table
        'product_id',  // Which product
        'quantity',    // How many units sold
        'is_tingi',    // Was this sold per piece o per pack?
        'unit_price',  // Price per unit at time ng sale
        'total_price', // Quantity × unit_price
    ];

    // Type casting
    protected $casts = [
        'is_tingi'    => 'boolean',        // Per piece or per pack
        'unit_price'  => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // ── Relationships ──

    // A sale item belongs to a product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // A sale item belongs to a sale
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
