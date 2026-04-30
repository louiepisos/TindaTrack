<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Utang Model - customer credit/installment records
// "Utang" = debt/credit sa Filipino
// Tracks kung magkano ang utang ng customer at kung magkano na ang nabayaran

class Utang extends Model
{
    // Table name kay different from convention - 'utang' instead of 'utangs'
    protected $table = 'utang';

    // Mass assignable attributes
    protected $fillable = [
        'customer_name',  // Name ng customer
        'contact_number', // Phone number para sa follow-up
        'total_amount',   // Total amount of credit extended
        'paid_amount',    // Amount already paid
        'status',         // unpaid, partial, or paid
        'user_id',        // Who created ang utang record
        'notes',          // Additional notes
    ];

    // Type casting
    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount'  => 'decimal:2',
    ];

    // ── Relationships ──

    // An utang ay may maraming line items (products)
    public function items(): HasMany
    {
        return $this->hasMany(UtangItem::class);
    }

    // An utang ay belongs to a user (who recorded it)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Computed Attributes ──

    // Get ang remaining balance (still owed)
    public function getRemainingAttribute(): float
    {
        return $this->total_amount - $this->paid_amount;
    }
}
