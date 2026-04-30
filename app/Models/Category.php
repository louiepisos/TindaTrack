<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Category Model - grouping para sa products
// Represent ang product categories tulad ng Beverages, Snacks, Dairy, etc.

class Category extends Model
{
    // Mass assignable attributes
    protected $fillable = [
        'name',        // Category name (e.g., "Beverages")
        'slug',        // URL-friendly version ng name
        'emoji',       // Visual icon/emoji para sa category
        'description', // Detailed description
        'color',       // Color para sa UI display
        'is_active',   // Active/inactive status
    ];

    // Type casting
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // A category ay may maraming products
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
