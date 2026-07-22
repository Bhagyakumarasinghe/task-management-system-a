<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'getUsers']);

    // Project Module
    Route::apiResource('projects', ProjectController::class);

    // Task Module
    Route::apiResource('tasks', TaskController::class)->only(['store', 'update', 'destroy']);

    // Dashboard Module
    Route::get('/dashboard', [DashboardController::class, 'index']);
});