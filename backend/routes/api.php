// routes/api.php dosyasında

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\AuthController;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

// --- Protected Routes (Requires Authentication) ---
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('todos')->group(function () {
        Route::get('/', [TodoController::class, 'index']);
        Route::get('/search', [TodoController::class, 'search']);
        Route::get('/{id}', [TodoController::class, 'show']);
        Route::post('/', [TodoController::class, 'store']);
        Route::put('/{id}', [TodoController::class, 'update']);
        Route::patch('/{id}/status', [TodoController::class, 'updateStatus']);
        Route::delete('/{id}', [TodoController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::get('/{id}/todos', [CategoryController::class, 'todos']);
    });

    Route::prefix('stats')->group(function () {
        Route::get('/todos', [StatsController::class, 'todosByStatus']);
        Route::get('/priorities', [StatsController::class, 'todosByPriority']);
    });
});