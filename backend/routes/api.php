<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/reviews', [\App\Http\Controllers\ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/reviews/me', [\App\Http\Controllers\ReviewController::class, 'checkReview']);
    Route::post('/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);

    Route::get('/demandes', [DemandeController::class, 'index']);
    Route::post('/demandes', [DemandeController::class, 'store']);
    Route::get('/demandes/{id}', [DemandeController::class, 'show']);
    Route::get('/demandes/{id}/download/{fileType}', [DemandeController::class, 'downloadFile']);
    Route::delete('/demandes/{id}', [DemandeController::class, 'destroy']);

    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);

    Route::middleware('admin')->group(function () {
        Route::patch('/demandes/{id}/status', [AdminController::class, 'updateStatus']);
        Route::get('/admin/users/{id}', [AdminController::class, 'showUser']);
        Route::post('/admin/users/{id}/notify', [AdminController::class, 'notifyUser']);
        Route::post('/admin/users/notify', [AdminController::class, 'notifyUsers']);
    });
});
