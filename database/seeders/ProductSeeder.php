<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;

// ProductSeeder - naga create og demo/test products
// Typical products nga makikita sa sari-sari store

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Helper functions para makuha ang category at supplier IDs by name
        $cat = fn($name) => Category::where('name', $name)->value('id');
        $sup = fn($name) => Supplier::where('name', 'like', "%{$name}%")->value('id');

        // Define ang products - real products sold sa sari-sari stores
        $products = [
            // ── BEVERAGES SECTION ──
            [
                'name'              => 'Milo 3-in-1 Sachet',
                'sku'               => 'BEV-001',
                'emoji'             => '☕',
                'description'       => 'Classic chocolate malt drink in convenient sachet.',
                'category_id'       => $cat('Beverages'),
                'supplier_id'       => $sup('Nestlé'),
                'unit_price'        => 9.00,
                'cost_price'        => 6.50,
                'stock_quantity'    => 32,
                'restock_threshold' => 15,
                'unit'              => 'sachet',
            ],
            [
                'name'              => 'Nescafé 3-in-1 Original',
                'sku'               => 'BEV-002',
                'emoji'             => '☕',
                'description'       => 'Instant coffee mix with sugar and creamer.',
                'category_id'       => $cat('Beverages'),
                'supplier_id'       => $sup('Nestlé'),
                'unit_price'        => 9.00,
                'cost_price'        => 6.00,
                'stock_quantity'    => 5,
                'restock_threshold' => 20,
                'unit'              => 'sachet',
            ],
            [
                'name'              => 'Zesto Orange 250ml',
                'sku'               => 'BEV-003',
                'emoji'             => '🧃',
                'description'       => 'Ready-to-drink orange-flavored juice drink.',
                'category_id'       => $cat('Beverages'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 10.00,
                'cost_price'        => 7.00,
                'stock_quantity'    => 3,
                'restock_threshold' => 24,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'C2 Green Tea Apple 230ml',
                'sku'               => 'BEV-004',
                'emoji'             => '🍵',
                'description'       => 'Ready-to-drink green tea with apple flavor.',
                'category_id'       => $cat('Beverages'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 15.00,
                'cost_price'        => 11.00,
                'stock_quantity'    => 24,
                'restock_threshold' => 12,
                'unit'              => 'pcs',
            ],

            // ── SNACKS SECTION ──
            [
                'name'              => 'Choco Mucho Wafer',
                'sku'               => 'SNA-001',
                'emoji'             => '🍫',
                'description'       => 'Chocolate wafer snack bar.',
                'category_id'       => $cat('Snacks'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 15.00,
                'cost_price'        => 10.00,
                'stock_quantity'    => 60,
                'restock_threshold' => 20,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'White Rabbit Candy',
                'sku'               => 'SNA-002',
                'emoji'             => '🍬',
                'description'       => 'Classic creamy milk candy.',
                'category_id'       => $cat('Snacks'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 5.00,
                'cost_price'        => 3.00,
                'stock_quantity'    => 12,
                'restock_threshold' => 30,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'SkyFlakes Crackers',
                'sku'               => 'SNA-003',
                'emoji'             => '🍪',
                'description'       => 'Light and crispy crackers.',
                'category_id'       => $cat('Snacks'),
                'supplier_id'       => $sup('Monde'),
                'unit_price'        => 12.00,
                'cost_price'        => 8.50,
                'stock_quantity'    => 45,
                'restock_threshold' => 15,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'Piattos Cheese 40g',
                'sku'               => 'SNA-004',
                'emoji'             => '🍟',
                'description'       => 'Potato crisps with cheese flavor.',
                'category_id'       => $cat('Snacks'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 22.00,
                'cost_price'        => 16.00,
                'stock_quantity'    => 30,
                'restock_threshold' => 12,
                'unit'              => 'pcs',
            ],

            // ── NOODLES SECTION ──
            [
                'name'              => 'Lucky Me Pancit Canton',
                'sku'               => 'NOO-001',
                'emoji'             => '🍜',
                'description'       => 'Stir-fried noodle snack, Filipino favorite.',
                'category_id'       => $cat('Noodles'),
                'supplier_id'       => $sup('Monde'),
                'unit_price'        => 14.00,
                'cost_price'        => 10.00,
                'stock_quantity'    => 8,
                'restock_threshold' => 20,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'Lucky Me Chicken Sopas',
                'sku'               => 'NOO-002',
                'emoji'             => '🍜',
                'description'       => 'Instant noodle soup with chicken flavor.',
                'category_id'       => $cat('Noodles'),
                'supplier_id'       => $sup('Monde'),
                'unit_price'        => 12.00,
                'cost_price'        => 8.50,
                'stock_quantity'    => 40,
                'restock_threshold' => 20,
                'unit'              => 'pcs',
            ],

            // ── DAIRY SECTION ──
            [
                'name'              => 'Bear Brand Powdered Milk 33g',
                'sku'               => 'DAI-001',
                'emoji'             => '🥛',
                'description'       => 'Full-cream powdered milk for the whole family.',
                'category_id'       => $cat('Dairy'),
                'supplier_id'       => $sup('Nestlé'),
                'unit_price'        => 28.00,
                'cost_price'        => 21.00,
                'stock_quantity'    => 48,
                'restock_threshold' => 12,
                'unit'              => 'sachet',
            ],

            // ── PERSONAL CARE SECTION ──
            [
                'name'              => 'Safeguard Soap Bar 135g',
                'sku'               => 'PER-001',
                'emoji'             => '🧴',
                'description'       => 'Antibacterial family soap bar.',
                'category_id'       => $cat('Personal Care'),
                'supplier_id'       => $sup('Unilever'),
                'unit_price'        => 45.00,
                'cost_price'        => 33.00,
                'stock_quantity'    => 22,
                'restock_threshold' => 10,
                'unit'              => 'pcs',
            ],
            [
                'name'              => 'Tender Care Tissue Roll',
                'sku'               => 'PER-002',
                'emoji'             => '🧻',
                'description'       => 'Soft and strong tissue paper roll.',
                'category_id'       => $cat('Personal Care'),
                'supplier_id'       => $sup('Universal'),
                'unit_price'        => 30.00,
                'cost_price'        => 22.00,
                'stock_quantity'    => 28,
                'restock_threshold' => 10,
                'unit'              => 'roll',
            ],
            [
                'name'              => 'Colgate Toothpaste 50ml',
                'sku'               => 'PER-003',
                'emoji'             => '🪥',
                'description'       => 'Classic cavity-protection toothpaste.',
                'category_id'       => $cat('Personal Care'),
                'supplier_id'       => $sup('Unilever'),
                'unit_price'        => 38.00,
                'cost_price'        => 28.00,
                'stock_quantity'    => 18,
                'restock_threshold' => 8,
                'unit'              => 'pcs',
            ],

            // ── CANNED GOODS SECTION ──
            [
                'name'              => 'Del Monte Tomato Sauce 250g',
                'sku'               => 'CAN-001',
                'emoji'             => '🥫',
                'description'       => 'Rich tomato sauce for cooking.',
                'category_id'       => $cat('Canned Goods'),
                'supplier_id'       => $sup('Del Monte'),
                'unit_price'        => 22.00,
                'cost_price'        => 16.00,
                'stock_quantity'    => 4,
                'restock_threshold' => 12,
                'unit'              => 'can',
            ],
            [
                'name'              => 'Century Tuna Flakes 180g',
                'sku'               => 'CAN-002',
                'emoji'             => '🐟',
                'description'       => 'Ready-to-eat tuna flakes in oil.',
                'category_id'       => $cat('Canned Goods'),
                'supplier_id'       => $sup('Century'),
                'unit_price'        => 35.00,
                'cost_price'        => 26.00,
                'stock_quantity'    => 36,
                'restock_threshold' => 12,
                'unit'              => 'can',
            ],

            // ── CONDIMENTS SECTION ──
            [
                'name'              => 'Silver Swan Soy Sauce 200ml',
                'sku'               => 'CON-001',
                'emoji'             => '🧂',
                'description'       => 'All-purpose soy sauce for Filipino cooking.',
                'category_id'       => $cat('Condiments'),
                'supplier_id'       => $sup('San Miguel'),
                'unit_price'        => 18.00,
                'cost_price'        => 13.00,
                'stock_quantity'    => 35,
                'restock_threshold' => 10,
                'unit'              => 'bottle',
            ],
            [
                'name'              => 'Datu Puti Vinegar 200ml',
                'sku'               => 'CON-002',
                'emoji'             => '🫙',
                'description'       => 'Cane vinegar, perfect for sawsawan.',
                'category_id'       => $cat('Condiments'),
                'supplier_id'       => $sup('San Miguel'),
                'unit_price'        => 15.00,
                'cost_price'        => 10.00,
                'stock_quantity'    => 20,
                'restock_threshold' => 8,
                'unit'              => 'bottle',
            ],
        ];

        // Loop through each product og mag-create sa database
        foreach ($products as $product) {
            // Merge array with is_active = true para sa tanan nga products
            Product::create(array_merge($product, ['is_active' => true]));
        }
    }
}
