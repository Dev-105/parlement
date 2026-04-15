<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = \App\Models\UserReview::with('user:id,first_name,last_name,role')
            ->whereNotNull('comment')
            ->orderByDesc('rating')
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'name' => trim($review->user->first_name . ' ' . $review->user->last_name),
                    'role' => class_basename($review->user->role) ? ucfirst($review->user->role) : 'Membres',
                    'text' => $review->comment,
                    'rating' => $review->rating
                ];
            });

        return response()->json($reviews);
    }
    public function checkReview(Request $request)
    {
        $hasReviewed = $request->user()->review()->exists();
        
        return response()->json([
            'has_reviewed' => $hasReviewed
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $user = $request->user();

        if ($user->review()->exists()) {
            return response()->json(['message' => 'Already reviewed'], 403);
        }

        $review = $user->review()->create([
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json([
            'message' => 'Review successfully submitted',
            'review' => $review
        ], 201);
    }
}
