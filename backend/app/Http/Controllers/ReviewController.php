<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
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
