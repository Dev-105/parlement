<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->notifications()->get();
        return response()->json([
            'message' => 'Notifications retrieved successfully',
            'data' => $notifications
        ]);
    }

    public function markAsRead(Request $request, $id): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);
        
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'message' => 'Notification marked as read successfully'
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        if ($request->user()->role === 'admin') {
            return response()->json([
                'message' => 'Admins are not allowed to delete notifications',
                'errors' => []
            ], 403);
        }

        $notification = $request->user()->notifications()->find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found',
                'errors' => []
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully',
            'data' => []
        ]);
    }

    public function destroyMultiple(Request $request): JsonResponse
    {
        if ($request->user()->role === 'admin') {
            return response()->json([
                'message' => 'Admins are not allowed to delete notifications',
                'errors' => []
            ], 403);
        }

        $ids = $request->input('ids', []);

        if (!is_array($ids) || count($ids) === 0) {
            return response()->json([
                'message' => 'Invalid notification IDs provided',
                'errors' => ['ids' => ['The ids field must be a non-empty array.']]
            ], 422);
        }

        $cleanIds = array_values(array_filter(array_map(function ($id) {
            return is_numeric($id) ? (int) $id : null;
        }, $ids), fn ($id) => $id !== null));

        if (count($cleanIds) === 0) {
            return response()->json([
                'message' => 'Invalid notification IDs provided',
                'errors' => ['ids' => ['The ids array must contain valid integers.']]
            ], 422);
        }

        $notifications = $request->user()->notifications()->whereIn('id', $cleanIds)->get();

        if ($notifications->isEmpty()) {
            return response()->json([
                'message' => 'No notifications found to delete',
                'errors' => []
            ], 404);
        }

        $request->user()->notifications()->whereIn('id', $cleanIds)->delete();

        return response()->json([
            'message' => 'Notifications deleted successfully',
            'data' => []
        ]);
    }
}
