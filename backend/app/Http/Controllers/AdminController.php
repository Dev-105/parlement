<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use App\Http\Resources\DemandeResource;
use App\Http\Resources\UserResource;
use App\Notifications\AdminMessageNotification;
use Illuminate\Support\Facades\Notification;
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

    public function showUser(Request $request, $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'errors' => []
            ], 404);
        }

        return response()->json([
            'message' => 'User retrieved successfully',
            'data' => new UserResource($user)
        ]);
    }

    public function listUsers(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('cin')) {
            $query->where('cin', 'like', '%' . $request->cin . '%');
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Users retrieved successfully',
            'data' => UserResource::collection($users)
        ]);
    }

    public function notifyUser(Request $request, $id): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'errors' => []
            ], 404);
        }

        $user->notify(new AdminMessageNotification($request->title, $request->message));

        return response()->json([
            'message' => 'Notification sent successfully',
            'data' => []
        ]);
    }

    public function notifyUsers(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'integer|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $userIds = array_unique($request->user_ids);
        $users = User::whereIn('id', $userIds)->get();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'No users found for notification',
                'errors' => []
            ], 404);
        }

        Notification::send($users, new AdminMessageNotification($request->title, $request->message));

        return response()->json([
            'message' => 'Notifications sent successfully',
            'data' => []
        ]);
    }

    public function sendNotification(Request $request, $id): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $user = User::findOrFail($id);
        
        // Send the notification with title and message
        $user->notify(new AdminMessageNotification($request->title, $request->message));

        return response()->json([
            'message' => 'Notification sent successfully',
            'data' => []
        ]);
    }

}
