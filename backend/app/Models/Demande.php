<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'status', 'title', 'message', 'submitted_at', 'processed_at'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stage()
    {
        return $this->hasOne(DemandeStage::class);
    }

    public function presse()
    {
        return $this->hasOne(DemandePresse::class);
    }

    public function bibliotheque()
    {
        return $this->hasOne(DemandeBibliotheque::class);
    }

    public function visite()
    {
        return $this->hasOne(DemandeVisite::class);
    }

    public function getDetailAttribute()
    {
        return match ($this->type) {
            'stage' => $this->stage,
            'presse' => $this->presse,
            'bibliotheque' => $this->bibliotheque,
            'visite' => $this->visite,
            default => null,
        };
    }
}
