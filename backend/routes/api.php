<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\StatsController;

// Todo İşlemleri
Route::prefix('todos')->group(function () {
    Route::get('/', [TodoController::class, 'index']);                   // GET /api/todos
    Route::get('/search', [TodoController::class, 'search']);            // GET /api/todos/search?q=...
    Route::get('/{id}', [TodoController::class, 'show']);                // GET /api/todos/{id}
    Route::post('/', [TodoController::class, 'store']);                  // POST /api/todos
    Route::put('/{id}', [TodoController::class, 'update']);              // PUT /api/todos/{id}
    Route::patch('/{id}/status', [TodoController::class, 'updateStatus']); // PATCH /api/todos/{id}/status
    Route::delete('/{id}', [TodoController::class, 'destroy']);          // DELETE /api/todos/{id}
});

// Kategori İşlemleri
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);               // GET /api/categories
    Route::get('/{id}', [CategoryController::class, 'show']);            // GET /api/categories/{id}
    Route::post('/', [CategoryController::class, 'store']);              // POST /api/categories
    Route::put('/{id}', [CategoryController::class, 'update']);          // PUT /api/categories/{id}
    Route::delete('/{id}', [CategoryController::class, 'destroy']);      // DELETE /api/categories/{id}
    Route::get('/{id}/todos', [CategoryController::class, 'todos']);     // GET /api/categories/{id}/todos
});

// İstatistik Uç Noktaları
Route::prefix('stats')->group(function () {
    Route::get('/todos', [StatsController::class, 'todosByStatus']);     // GET /api/stats/todos
    Route::get('/priorities', [StatsController::class, 'todosByPriority']); // GET /api/stats/priorities
});
