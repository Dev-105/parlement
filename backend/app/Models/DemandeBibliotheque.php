<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeBibliotheque extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id', 'research_topic', 'institution', 'visit_date', 'duration', 'purpose'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
