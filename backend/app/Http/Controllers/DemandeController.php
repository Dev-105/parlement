<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Http\Requests\StoreDemandeRequest;
use App\Http\Resources\DemandeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $demandes = $request->user()->demandes()
            ->with(['stage', 'presse', 'bibliotheque', 'visite'])
            ->get();

        return response()->json([
            'message' => 'Demandes retrieved successfully',
            'data' => DemandeResource::collection($demandes)
        ]);
    }

    public function store(StoreDemandeRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $demande = $request->user()->demandes()->create([
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'submitted_at' => now(),
        ]);

        switch ($data['type']) {
            case 'stage':
                $demande->stage()->create([
                    'school_name' => $data['school_name'] ?? null,
                    'field_of_study' => $data['field_of_study'] ?? null,
                    'motivation_letter' => $data['motivation_letter'] ?? null,
                    'start_date' => $data['start_date'] ?? null,
                    'end_date' => $data['end_date'] ?? null,
                ]);
                break;
            case 'presse':
                $demande->presse()->create([
                    'media_name' => $data['media_name'] ?? null,
                    'press_card_number' => $data['press_card_number'] ?? null,
                    'organization' => $data['organization'] ?? null,
                ]);
                break;
            case 'bibliotheque':
                $demande->bibliotheque()->create([
                    'research_topic' => $data['research_topic'] ?? null,
                    'institution' => $data['institution'] ?? null,
                    'visit_date' => $data['visit_date'] ?? null,
                    'duration' => $data['duration'] ?? null,
                    'purpose' => $data['purpose'] ?? null,
                ]);
                break;
            case 'visite':
                $demande->visite()->create([
                    'school_name' => $data['school_name'] ?? null,
                    'number_of_students' => $data['number_of_students'] ?? null,
                    'grade_level' => $data['grade_level'] ?? null,
                    'visit_date' => $data['visit_date'] ?? null,
                    'supervisor_name' => $data['supervisor_name'] ?? null,
                    'phone' => $data['phone'] ?? null,
                ]);
                break;
        }

        $demande->load(['stage', 'presse', 'bibliotheque', 'visite']);

        return response()->json([
            'message' => 'Demande created successfully',
            'data' => new DemandeResource($demande)
        ], 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $demande = $request->user()->demandes()
            ->with(['stage', 'presse', 'bibliotheque', 'visite'])
            ->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande not found',
                'errors' => []
            ], 404);
        }

        return response()->json([
            'message' => 'Demande retrieved successfully',
            'data' => new DemandeResource($demande)
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $demande = $request->user()->demandes()->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande not found',
                'errors' => []
            ], 404);
        }

        $demande->delete();

        return response()->json([
            'message' => 'Demande deleted successfully',
            'data' => []
        ]);
    }
}
