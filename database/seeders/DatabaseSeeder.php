<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// DatabaseSeeder - ang main seeder na nag-call sa tanan nga sub-seeders
// Ginagamit para i-populate ang database with test/demo data

class DatabaseSeeder extends Seeder
{
    // Ang run method kay gina-call sa `php artisan db:seed`
    // Nag-execute sa tanan nga seeder classes
    public function run(): void
    {
        // Mag-call sa seeders in order - order matters kung naay dependencies
        $this->call([
            UserSeeder::class,       // Create users first
            CategorySeeder::class,   // Then categories
            SupplierSeeder::class,   // Then suppliers
            ProductSeeder::class,    // Finally products (depends on categories at suppliers)
        ]);
    }
}
