<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// UtangItem Model - line items sa utang record
// Store ang individual products na kinuha on credit

class UtangItem extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'utang_id',    // Foreign key sa utang table
        'product_id',  // Which product
        'quantity',    // How many units
        'is_tingi',    // Per piece o per pack?
        'unit_price',  // Price per unit when credit was extended
        'total_price', // Quantity × unit_price
    ];

    // Type casting
    protected $casts = [
        'is_tingi'    => 'boolean',
        'unit_price'  => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // ── Relationships ──

    // An utang item belongs to a product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // An utang item belongs to an utang record
    public function utang(): BelongsTo
    {
        return $this->belongsTo(Utang::class);
    }
}
