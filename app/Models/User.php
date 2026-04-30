<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// User Model - represent ang app users
// May authentication capabilities at notifications
// Attributes na fillable (pwedeng i-mass assign):
// - name: user's display name
// - email: unique email address
// - password: hashed password

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get ang attributes na dapat i-cast sa specific types.
     * Ito ay nag-ensure na ang data ay may correct type bago gamitin
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',  // Cast to datetime object
            'password' => 'hashed',              // Password ay automatically hashed
        ];
    }
}
