<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use App\Notifications\AdminMessageNotification;
use App\Http\Requests\StoreDemandeRequest;
use App\Http\Resources\DemandeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class DemandeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->role === 'admin'
            ? Demande::with(['stage', 'presse', 'bibliotheque', 'visite', 'user'])
            : $request->user()->demandes()->with(['stage', 'presse', 'bibliotheque', 'visite']);

        if ($request->filled('status') && in_array($request->status, ['pending', 'in_review', 'accepted', 'rejected'])) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && in_array($request->type, ['stage', 'presse', 'bibliotheque', 'visite'])) {
            $query->where('type', $request->type);
        }

        if ($request->filled('cin') && $request->user()->role === 'admin') {
            $query->whereHas('user', function ($query) use ($request) {
                $query->where('cin', 'like', '%' . $request->cin . '%');
            });
        }

        $demandes = $query->orderBy('created_at', 'desc')->get();

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
                // Handle CV file upload
                $cvPath = null;
                if ($request->hasFile('cv_file')) {
                    $cvPath = $request->file('cv_file')->store('cvs', 'public');
                }
                
                $demande->stage()->create([
                    'school_name' => $data['school_name'] ?? null,
                    'field_of_study' => $data['field_of_study'] ?? null,
                    'motivation_letter' => $data['motivation_letter'] ?? null,
                    'start_date' => $data['start_date'] ?? null,
                    'end_date' => $data['end_date'] ?? null,
                    'cv_file' => $cvPath,
                ]);
                break;
                
            case 'presse':
                // Handle supporting document upload
                $documentPath = null;
                if ($request->hasFile('supporting_document')) {
                    $documentPath = $request->file('supporting_document')->store('supporting_documents', 'public');
                }
                
                $demande->presse()->create([
                    'media_name' => $data['media_name'] ?? null,
                    'organization' => $data['organization'] ?? null,
                    'supporting_document' => $documentPath,
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
        $user = $request->user();
        
        // If admin, can view any demande
        if ($user->role === 'admin') {
            $demande = Demande::with(['stage', 'presse', 'bibliotheque', 'visite', 'user'])
                ->find($id);
        } else {
            // Regular users can only view their own demandes
            $demande = $user->demandes()
                ->with(['stage', 'presse', 'bibliotheque', 'visite'])
                ->find($id);
        }

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

    public function downloadFile(Request $request, $id, $fileType)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $demande = Demande::with(['stage', 'presse'])->find($id);
        } else {
            $demande = $user->demandes()
                ->with(['stage', 'presse'])
                ->find($id);
        }

        if (!$demande) {
            return response()->json([
                'message' => 'Demande not found',
                'errors' => []
            ], 404);
        }

        $path = null;
        $filename = null;

        if ($fileType === 'cv_file' && $demande->stage?->cv_file) {
            $path = $demande->stage->cv_file;
            $filename = 'cv_' . $demande->id . '.' . pathinfo($path, PATHINFO_EXTENSION);
        } elseif ($fileType === 'supporting_document' && $demande->presse?->supporting_document) {
            $path = $demande->presse->supporting_document;
            $filename = 'supporting_document_' . $demande->id . '.' . pathinfo($path, PATHINFO_EXTENSION);
        }

        if (!$path) {
            return response()->json([
                'message' => 'File not found',
                'errors' => []
            ], 404);
        }

        return response()->download(Storage::disk('public')->path($path), $filename);
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
        
        // Delete associated files before deleting the demande
        if ($demande->stage && $demande->stage->cv_file) {
            Storage::disk('public')->delete($demande->stage->cv_file);
        }
        
        if ($demande->presse && $demande->presse->supporting_document) {
            Storage::disk('public')->delete($demande->presse->supporting_document);
        }

        $user = $request->user();
        $demandeId = $demande->id;
        $demandeType = ucfirst($demande->type);
        $userName = trim($user->first_name . ' ' . $user->last_name) ?: $user->email;
        $adminMessage = "L'utilisateur {$userName} ({$user->email}) a supprimé sa demande {$demandeType} (ID: {$demandeId}).";

        $demande->delete();

        $adminUsers = User::where('role', 'admin')->get();
        if ($adminUsers->isNotEmpty()) {
            Notification::send($adminUsers, new AdminMessageNotification('Demande supprimée', $adminMessage));
        }

        return response()->json([
            'message' => 'Demande deleted successfully',
            'data' => []
        ]);
    }
}