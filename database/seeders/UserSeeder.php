<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

// UserSeeder - nag-create ng default user accounts
// Ginagamit para sa development at testing

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create ang default store owner account
        // Email: admin@tindatrack.ph, Password: password
        User::create([
            'name'     => 'Louie Jay Pisos',  // Store owner name
            'email'    => 'admin@tindatrack.ph',
            'password' => Hash::make('password'),  // Hashed password
        ]);

        // Create demo/guest account para sa testing
        // Email: demo@tindatrack.ph, Password: password
        User::create([
            'name'     => 'Demo User',
            'email'    => 'demo@tindatrack.ph',
            'password' => Hash::make('password'),
        ]);
    }
}
