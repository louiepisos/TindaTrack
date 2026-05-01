<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

// SupplierSeeder - nga ga create sa supplier records
// Suppliers kay companies nga naga provide sa products which is optionnal sa sari-sari store
//  pero useful para sa inventory management

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        // Define ang list sa major suppliers sa Philippines
        // Real companies na naga-supply sa goods sa sari-sari stores
        $suppliers = [
            // Nestlé Philippines - naga-supply sa beverages og dairy
            [
                'name'           => 'Nestlé Philippines',
                'contact_person' => 'Juan Dela Cruz',
                'email'          => 'orders@nestle.com.ph',
                'phone'          => '02-8898-0000',
                'address'        => '7/F The Podium West Tower, ADB Ave',
                'city'           => 'Mandaluyong',
            ],
            // URC (Universal Robina Corp) - naga-supply sa beverages, snacks, noodles
            [
                'name'           => 'Universal Robina Corp',
                'contact_person' => 'Ana Reyes',
                'email'          => 'trade@urc.com.ph',
                'phone'          => '02-8633-7631',
                'address'        => 'URC Head Office, Paseo de Roxas',
                'city'           => 'Makati',
            ],
            // Monde Nissin - naga-supply sa noodles
            [
                'name'           => 'Monde Nissin',
                'contact_person' => 'Pedro Santos',
                'email'          => 'sales@mondenissin.com',
                'phone'          => '02-8687-4567',
                'address'        => 'Monde Nissin Corp, EDSA',
                'city'           => 'Quezon City',
            ],
            // Del Monte Philippines - naga-supply sa canned goods
            [
                'name'           => 'Del Monte Philippines',
                'contact_person' => 'Rosa Garcia',
                'email'          => 'orders@delmontephil.com',
                'phone'          => '02-8887-3456',
                'address'        => '8/F Eight Rockwell, Rockwell Drive',
                'city'           => 'Makati',
            ],
            // Unilever Philippines - naga-supply sa personal care products
            [
                'name'           => 'Unilever Philippines',
                'contact_person' => 'Carlo Bautista',
                'email'          => 'trade@unilever.com.ph',
                'phone'          => '02-8558-8000',
                'address'        => 'Unilever Centre, Bonifacio Global City',
                'city'           => 'Taguig',
            ],
            // San Miguel Foods - naga-supply sa condiments at canned goods
            [
                'name'           => 'San Miguel Foods',
                'contact_person' => 'Liza Villanueva',
                'email'          => 'orders@sanmiguelfoods.com',
                'phone'          => '02-8632-3000',
                'address'        => '40 San Miguel Ave',
                'city'           => 'Mandaluyong',
            ],
            // Century Pacific Food - naga-supply sa canned goods (tuna, etc)
            [
                'name'           => 'Century Pacific Food',
                'contact_person' => 'Mario Cruz',
                'email'          => 'sales@centurypacific.com.ph',
                'phone'          => '02-8586-3888',
                'address'        => '7/F Centerpoint Building, Julia Vargas Ave',
                'city'           => 'Pasig',
            ],
        ];

        // Loop through each supplier og mag-create sa database
        foreach ($suppliers as $supplier) {
            // Merge array with is_active = true para sa tanan
            Supplier::create(array_merge($supplier, ['is_active' => true]));
        }
    }
}
