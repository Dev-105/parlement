<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DemandeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'type' => $this->type,
            'status' => $this->status,
            'title' => $this->title,
            'message' => $this->message,
            'submitted_at' => $this->submitted_at,
            'processed_at' => $this->processed_at,
            'details' => $this->detail, // Relies on getDetailAttribute() in Demande model
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
