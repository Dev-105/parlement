<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DemandeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $details = $this->detail;

        if ($details) {
            if ($this->type === 'stage' && !empty($details->cv_file)) {
                $details->cv_file = Storage::disk('public')->url($details->cv_file);
            }

            if ($this->type === 'presse' && !empty($details->supporting_document)) {
                $details->supporting_document = Storage::disk('public')->url($details->supporting_document);
            }
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
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
