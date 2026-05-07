<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id', 'cv_file', 'school_name', 'field_of_study', 'motivation_letter', 'start_date', 'end_date'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
