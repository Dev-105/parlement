<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDemandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'type' => 'required|in:stage,presse,bibliotheque,visite',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ];

        if ($this->input('type') === 'stage') {
            $rules['school_name'] = 'required|string|max:255';
            $rules['field_of_study'] = 'required|string|max:255';
            $rules['motivation_letter'] = 'nullable|string';
            $rules['start_date'] = 'nullable|date';
            $rules['end_date'] = 'nullable|date|after_or_equal:start_date';
        } elseif ($this->input('type') === 'presse') {
            $rules['media_name'] = 'required|string|max:255';
            $rules['press_card_number'] = 'required|string|max:255';
            $rules['organization'] = 'required|string|max:255';
        } elseif ($this->input('type') === 'bibliotheque') {
            $rules['research_topic'] = 'required|string|max:255';
            $rules['institution'] = 'required|string|max:255';
            $rules['visit_date'] = 'nullable|date';
            $rules['duration'] = 'nullable|string|max:255';
            $rules['purpose'] = 'nullable|string';
        } elseif ($this->input('type') === 'visite') {
            $rules['school_name'] = 'required|string|max:255';
            $rules['number_of_students'] = 'required|integer|min:1';
            $rules['grade_level'] = 'required|string|max:255';
            $rules['visit_date'] = 'nullable|date';
            $rules['supervisor_name'] = 'required|string|max:255';
            $rules['phone'] = 'required|string|max:255';
        }

        return $rules;
    }
}
