<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nous ne trouvons pas d\'utilisateur avec cette adresse e-mail.'
            ], 404);
        }

        $email = $request->email;
        $user = User::where('email', $email)->first();
        $userName = $user->first_name . ' ' . $user->last_name;
        $token = Str::random(60);

        // Remove old tokens for this email
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        // Insert new token
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Define reset link
        $frontendUrl = config('app.url', 'http://localhost:5173');
        // If they use standard port for Vite, we'll assume standard URL but we might want to ensure it works
        $resetLink = env('FRONTEND_URL', 'http://localhost:5173') . "/reset-password?token=" . $token . "&email=" . urlencode($email);

        try {
            Mail::to($email)->send(new ResetPasswordMail($resetLink, $userName));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Un e-mail de réinitialisation de mot de passe a été envoyé.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'envoi de l\'e-mail.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $resetData = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetData || !Hash::check($request->token, $resetData->token)) {
             return response()->json([
                'status' => 'error',
                'message' => 'Le lien de réinitialisation est invalide ou a expiré.'
            ], 400);
        }

        // Check if token expired (e.g., older than 60 minutes)
        if (Carbon::parse($resetData->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'status' => 'error',
                'message' => 'Le lien de réinitialisation a expiré.'
            ], 400);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Invalidate tokens
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Votre mot de passe a été réinitialisé avec succès.'
        ], 200);
    }
}
