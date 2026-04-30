<?php
// ============================================================
// app/Models/Supplier.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = [
        'name', 'contact_person', 'email', 'phone',
        'address', 'city', 'is_active', 'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}


<?php
// ============================================================
// app/Models/Product.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'sku', 'emoji', 'description',
        'category_id', 'supplier_id',
        'unit_price', 'cost_price',
        'stock_quantity', 'restock_threshold', 'max_stock',
        'unit', 'barcode', 'is_active',
    ];

    protected $casts = [
        'unit_price'        => 'decimal:2',
        'cost_price'        => 'decimal:2',
        'stock_quantity'    => 'integer',
        'restock_threshold' => 'integer',
        'is_active'         => 'boolean',
    ];

    // ── Relationships ──
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    // ── Computed status ──
    public function getStatusAttribute(): string
    {
        if ($this->stock_quantity <= 0) return 'critical';
        if ($this->stock_quantity <= ($this->restock_threshold * 0.5)) return 'critical';
        if ($this->stock_quantity <= $this->restock_threshold) return 'low';
        return 'active';
    }

    // ── Total units sold (last 30 days) ──
    public function getSoldLast30Attribute(): int
    {
        return $this->transactions()
            ->where('type', 'sale')
            ->where('transacted_at', '>=', now()->subDays(30))
            ->sum('quantity') * -1; // sales are stored as negative qty
    }

    protected $appends = ['status'];
}


<?php
// ============================================================
// app/Models/Transaction.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'product_id', 'user_id', 'type',
        'quantity', 'stock_before', 'stock_after',
        'unit_price', 'total_amount',
        'reference_number', 'notes', 'transacted_at',
    ];

    protected $casts = [
        'quantity'       => 'integer',
        'stock_before'   => 'integer',
        'stock_after'    => 'integer',
        'unit_price'     => 'decimal:2',
        'total_amount'   => 'decimal:2',
        'transacted_at'  => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
