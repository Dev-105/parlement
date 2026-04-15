<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandePresse extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id', 'media_name', 'organization', 'supporting_document'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
