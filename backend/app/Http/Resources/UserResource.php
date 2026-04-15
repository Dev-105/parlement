<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'cin' => $this->cin,
            'name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth,
            'nationality' => $this->nationality,
            'country' => $this->country,
            'city' => $this->city,
            'address_line' => $this->address_line,
            'postal_code' => $this->postal_code,
            'description' => $this->description,
            'role' => $this->role,
            'status' => $this->status,
            'profile_image' => $this->profile_image ? asset('storage/' . $this->profile_image) : null,
            'banner_image' => $this->banner_image ? asset('storage/' . $this->banner_image) : null,
            'cv_file' => $this->cv_file ? asset('storage/' . $this->cv_file) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}