<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Supplier Model - nag-supply ng products
// Contain ang contact information at location ng supplier

class Supplier extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'name',            // Supplier business name
        'contact_person',  // Primary contact person
        'email',           // Email address
        'phone',           // Phone number
        'address',         // Physical address
        'city',            // City location
        'is_active',       // Active/inactive status
        'notes',           // Additional notes/info
    ];

    // Type casting
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // A supplier ay may maraming products
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
