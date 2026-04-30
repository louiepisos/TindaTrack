<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Product Model - represent ang inventory items/products
// May pricing info, stock levels, at relationships sa category at supplier
// Gumagamit ng soft deletes - products ay hindi talaga mabubura kundi marked as deleted

class Product extends Model
{
    // Enable soft delete functionality - products ay marked as deleted, not actually removed
    use SoftDeletes;

    // Mass assignable attributes - pwedeng i-set sa create/update
    protected $fillable = [
        'name', 'sku', 'emoji', 'description',
        'category_id', 'supplier_id',
        'unit_price', 'cost_price', 'tingi_price', 'pieces_per_pack',
        'stock_quantity', 'restock_threshold', 'max_stock',
        'unit', 'barcode', 'is_active',
    ];

    // Type casting - ensure proper data types
    protected $casts = [
        'unit_price'        => 'decimal:2',   // 2 decimal places for prices
        'cost_price'        => 'decimal:2',
        'tingi_price'       => 'decimal:2',
        'pieces_per_pack'   => 'integer',
        'stock_quantity'    => 'integer',
        'restock_threshold' => 'integer',
        'is_active'         => 'boolean',
    ];

    // ── Relationships ──

    // Product belongs to a category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Product ay supplied by a supplier
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    // Product ay pwedeng may maraming transactions (sales, restocks, adjustments)
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    // ── Computed/Virtual Attributes ──

    // Get ang stock status - critical, low, or active
    // Used para sa UI alerts at inventory management
    public function getStatusAttribute(): string
    {
        // Critical: walang stock o very low
        if ($this->stock_quantity <= 0) return 'critical';
        // Critical: below 50% ng restock threshold
        if ($this->stock_quantity <= ($this->restock_threshold * 0.5)) return 'critical';
        // Low: below restock threshold
        if ($this->stock_quantity <= $this->restock_threshold) return 'low';
        // Active: healthy stock level
        return 'active';
    }

    // Get ang units sold in last 30 days
    // Used para ma-track ang sales velocity ng product
    public function getSoldLast30Attribute(): int
    {
        return $this->transactions()
            ->where('type', 'sale')
            ->where('transacted_at', '>=', now()->subDays(30))
            ->sum('quantity') * -1;  // Multiply by -1 because sales are negative qty
    }

    // Append computed attributes sa model output
    protected $appends = ['status'];
}
