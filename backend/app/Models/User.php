<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 'last_name', 'cin', 'email', 'password', 'phone', 'date_of_birth',
        'nationality', 'country', 'city', 'address_line', 'postal_code', 
        'description', 'profile_image', 'banner_image', 'cv_file', 'role', 'status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}
