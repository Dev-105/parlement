<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Notifications\AdminMessageNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make($request->password),
        ]);

        $user->notify(new AdminMessageNotification(
            'Bienvenue sur Parlement',
            'Bienvenue dans la plateforme Parlement ! Nous sommes ravis de vous compter parmi nous. Vous pouvez maintenant soumettre des demandes et suivre leur progression depuis votre espace personnel.'
        ));

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token
            ]
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => ['email' => ['These credentials do not match our records.']]
            ], 401);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Account is suspended',
                'errors' => []
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token
            ]
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
            'data' => []
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'User profile',
            'data' => new UserResource($request->user())
        ]);
    }

public function updateProfile(Request $request): JsonResponse
{
    $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'phone' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
        'address_line' => 'nullable|string|max:255',
        'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        'banner_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
    ]);

    $user = $request->user();

    // Handle profile image upload
    if ($request->hasFile('profile_image')) {
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }
        $path = $request->file('profile_image')->store('profile_images', 'public');
        $user->profile_image = $path;
    }

    // Handle banner image upload
    if ($request->hasFile('banner_image')) {
        if ($user->banner_image) {
            Storage::disk('public')->delete($user->banner_image);
        }
        $path = $request->file('banner_image')->store('banner_images', 'public');
        $user->banner_image = $path;
    }

    // Update user data
    $user->first_name = $request->first_name;
    $user->last_name = $request->last_name;
    $user->phone = $request->phone;
    $user->city = $request->city;
    $user->address_line = $request->address_line;
    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'data' => new UserResource($user)
    ]);
}

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }
}
