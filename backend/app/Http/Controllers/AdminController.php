<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use App\Http\Resources\DemandeResource;
use App\Http\Resources\UserResource;
use App\Notifications\AdminMessageNotification;
use App\Mail\AdminDirectEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Mail;
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

        $oldStatus = $demande->status;
        $demande->status = $request->status;
        
        if (in_array($request->status, ['accepted', 'rejected'])) {
            $demande->processed_at = now();
        }
        
        $demande->save();

        // Send notification to user about status change
        $this->sendStatusUpdateNotification($demande, $request->status);

        return response()->json([
            'message' => 'Demande status updated successfully',
            'data' => new DemandeResource($demande)
        ]);
    }

    /**
     * Send notification to user when demande status is updated
     */
    private function sendStatusUpdateNotification(Demande $demande, string $newStatus): void
    {
        $statusMessages = [
            'pending' => 'Votre demande est en attente de traitement.',
            'in_review' => 'Votre demande est actuellement en révision.',
            'accepted' => 'Félicitations! Votre demande a été acceptée.',
            'rejected' => 'Votre demande a malheureusement été rejetée.',
        ];

        $statusLabels = [
            'pending' => 'En attente',
            'in_review' => 'En révision',
            'accepted' => 'Acceptée',
            'rejected' => 'Rejetée',
        ];

        $title = 'Mise à jour de votre demande - ' . $statusLabels[$newStatus];
        $message = $statusMessages[$newStatus];

        $demande->user->notify(new AdminMessageNotification($title, $message));
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

    public function sendEmail(Request $request): JsonResponse
    {
        $request->validate([
            'emails' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'color' => 'required|in:orange,red,green'
        ]);

        $emailsString = $request->emails;
        $title = $request->title;
        $message = $request->message;
        $color = $request->color;

        // Parse emails - split by commas, semicolons, or newlines
        $emails = preg_split('/[,;\n\r]+/', $emailsString);
        $emails = array_map('trim', $emails);
        $emails = array_filter($emails, function($email) {
            return filter_var($email, FILTER_VALIDATE_EMAIL);
        });

        if (empty($emails)) {
            return response()->json([
                'message' => 'No valid email addresses provided',
                'errors' => ['emails' => 'Please provide at least one valid email address']
            ], 422);
        }

        $sentCount = 0;
        $userNotifications = 0;

        foreach ($emails as $email) {
            // Check if email belongs to a user
            $user = User::where('email', $email)->first();

            if ($user) {
                // Send notification to user
                $user->notify(new AdminMessageNotification($title, $message, $color));
                $userNotifications++;
            } else {
                // Send email directly to the email address using branded template
                try {
                    \Illuminate\Support\Facades\Mail::to($email)->send(new AdminDirectEmail($title, $message, $email, $color));
                    $sentCount++;
                } catch (\Exception $e) {
                    // Log error but continue with other emails
                    \Log::error("Failed to send email to {$email}: " . $e->getMessage());
                }
            }
        }

        return response()->json([
            'message' => "Emails sent successfully. Direct emails: {$sentCount}, User notifications: {$userNotifications}",
            'data' => [
                'total_emails' => count($emails),
                'direct_emails_sent' => $sentCount,
                'user_notifications_sent' => $userNotifications
            ]
        ]);
    }

}
