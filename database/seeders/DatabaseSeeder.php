<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// DatabaseSeeder - ang main seeder na nag-call ng lahat ng sub-seeders
// Ginagamit para i-populate ang database with test/demo data

class DatabaseSeeder extends Seeder
{
    // Ang run method ay tina-call ng `php artisan db:seed`
    // Nag-execute ng lahat ng seeder classes
    public function run(): void
    {
        // Mag-call ng seeders in order - order matters kung may dependencies
        $this->call([
            UserSeeder::class,       // Create users first
            CategorySeeder::class,   // Then categories
            SupplierSeeder::class,   // Then suppliers
            ProductSeeder::class,    // Finally products (depends on categories at suppliers)
        ]);
    }
}
