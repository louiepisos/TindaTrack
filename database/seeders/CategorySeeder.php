<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;

// CategorySeeder - nag-create ng product categories
// Categories ay ginagamit para mag-organize ng products sa catalog

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Define ang list ng categories para sa sari-sari store
        // May name, emoji, color, at description para sa bawat category
        $categories = [
            // Beverages category - drinks tulad ng juice, coffee, water
            ['name' => 'Beverages',     'emoji' => '🧃', 'color' => 'blue',   'description' => 'Juice drinks, coffee, softdrinks, and water.'],
            // Snacks - chips, candies, crackers, etc.
            ['name' => 'Snacks',        'emoji' => '🍫', 'color' => 'gold',   'description' => 'Chips, wafers, candies, and crackers.'],
            // Noodles - instant noodles at pancit canton
            ['name' => 'Noodles',       'emoji' => '🍜', 'color' => 'purple', 'description' => 'Instant noodles and pancit canton.'],
            // Dairy - milk, cheese, yogurt
            ['name' => 'Dairy',         'emoji' => '🥛', 'color' => 'green',  'description' => 'Milk, cheese, and dairy products.'],
            // Personal Care - soaps, shampoo, toothpaste
            ['name' => 'Personal Care', 'emoji' => '🧴', 'color' => 'red',    'description' => 'Soaps, shampoos, toothpaste, and hygiene items.'],
            // Canned Goods - canned meat, fish, vegetables
            ['name' => 'Canned Goods',  'emoji' => '🥫', 'color' => 'orange', 'description' => 'Canned meat, fish, fruits, and sauces.'],
            // Condiments - soy sauce, vinegar, cooking oil
            ['name' => 'Condiments',    'emoji' => '🧂', 'color' => 'muted',  'description' => 'Soy sauce, vinegar, cooking oil, and seasonings.'],
            // Household - tissue, detergent, cleaning supplies
            ['name' => 'Household',     'emoji' => '🧻', 'color' => 'blue',   'description' => 'Tissue, detergent, and cleaning supplies.'],
        ];

        // Loop through each category at mag-create sa database
        foreach ($categories as $cat) {
            Category::create([
                'name'        => $cat['name'],
                'slug'        => Str::slug($cat['name']),      // URL-friendly version
                'emoji'       => $cat['emoji'],
                'color'       => $cat['color'],                // Para sa UI styling
                'description' => $cat['description'],
                'is_active'   => true,                         // Categories ay active by default
            ]);
        }
    }
}
