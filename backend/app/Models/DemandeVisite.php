<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeVisite extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id', 'school_name', 'number_of_students', 'grade_level', 'visit_date', 'supervisor_name', 'phone'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
