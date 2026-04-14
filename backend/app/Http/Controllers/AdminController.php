<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Http\Resources\DemandeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,in_review,accepted,rejected'
        ]);

        $demande = Demande::with(['user', 'stage', 'presse', 'bibliotheque', 'visite'])->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Demande not found',
                'errors' => []
            ], 404);
        }

        $demande->status = $request->status;
        
        if (in_array($request->status, ['accepted', 'rejected'])) {
            $demande->processed_at = now();
        }
        
        $demande->save();

        return response()->json([
            'message' => 'Demande status updated successfully',
            'data' => new DemandeResource($demande)
        ]);
    }
}
