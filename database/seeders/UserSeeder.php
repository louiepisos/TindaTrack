<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

// UserSeeder - naga-create sa default user accounts
// Ginagamit para sa development og testing

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create ang default store owner account
        // Email: admin@tindatrack.ph, Password: password
        User::updateOrCreate(
            ['email' => 'admin@tindatrack.ph'],
            [
                'name'     => 'Louie Jay Pisos',
                'password' => Hash::make('password'),
            ]
        );

        // Create demo/guest account para sa testing
        // Email: demo@tindatrack.ph, Password: password
        User::updateOrCreate(
            ['email' => 'demo@tindatrack.ph'],
            [
                'name'     => 'Demo User',
                'password' => Hash::make('password'),
            ]
        );
    }
}
