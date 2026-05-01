<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Sale Model - represent ang sales transactions
// Store ang sale header information - total amount, payment type, etc.
// Individual items kay stored sa SaleItem model

class Sale extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'user_id',       // Who made the sale
        'total_amount',  // Total amount of the sale
        'amount_given',  // Cash amount given by customer (kung cash payment)
        'change_amount', // Change to give back
        'payment_type',  // 'paid' (cash) o 'utang' (credit)
        'utang_id',      // Link to utang record kung credit
    ];

    // Type casting para sa decimal precision
    protected $casts = [
        'total_amount'  => 'decimal:2',
        'amount_given'  => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    // ── Relationships ──

    // A sale kay daghan line items
    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    // A sale kay belongs to a user (salesperson)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A sale kay linked to utang record (if credit sale)
    public function utang(): BelongsTo
    {
        return $this->belongsTo(Utang::class);
    }
}
