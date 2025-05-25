<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TodoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; 

class TodoController extends Controller
{
    protected $todoService;

    public function __construct(TodoService $todoService)
    {
        $this->todoService = $todoService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Tüm todoları getirir (filtreleme, sıralama ve sayfalama ile).
     */
    public function index(Request $request): JsonResponse
    {
    $filters = $request->only(['status', 'priority', 'q']);
    $limit = $request->get('limit', 10);
    $sort = $request->get('sort', 'created_at');
    $order = $request->get('order', 'desc');

    $todos = $this->todoService->getAllTodos($filters, $limit, $sort, $order);

    return response()->json($todos); 
}

    /**
     * Belirli bir todoyu ID'sine göre getirir.
     */
    public function show($id): JsonResponse
    {
        $todo = $this->todoService->getTodoById($id);

        if (!$todo) {
            return response()->json([
                'status' => 'error',
                'message' => 'Todo bulunamadı.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $todo,
        ]);
    }

    /**
     * Yeni bir todo oluşturur.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|min:3|max:100',
                'description' => 'nullable|string|max:500',
                'status' => 'required|in:pending,in_progress,completed,cancelled',
                'priority' => 'required|in:low,medium,high',
                'due_date' => 'nullable|date', 
                'category_id' => 'nullable|exists:categories,id', 
            ]);

            $validatedData['user_id'] = Auth::id();

            $todo = $this->todoService->createTodo($validatedData);

            if (isset($validatedData['category_id']) && $validatedData['category_id'] !== null) {
                $todo->categories()->attach($validatedData['category_id']);
            }

            return response()->json(['status' => 'success', 'data' => $todo], 201); // 201 Created

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Todo oluşturulurken hata oluştu: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Todo oluşturulurken beklenmeyen bir hata oluştu.',
            ], 500);
        }
    }

    /**
     * Mevcut bir todoyu günceller.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|min:3|max:100',
                'description' => 'nullable|string|max:500',
                'status' => 'sometimes|required|in:pending,in_progress,completed,cancelled',
                'priority' => 'sometimes|required|in:low,medium,high',
                'due_date' => 'nullable|date',
                'category_id' => 'nullable|exists:categories,id',
            ]);

            $todo = $this->todoService->updateTodo($id, $validatedData);

            if (!$todo) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Güncellenecek todo bulunamadı.',
                ], 404);
            }

            if (isset($validatedData['category_id'])) {
                if ($validatedData['category_id'] !== null) {
                    $todo->categories()->sync($validatedData['category_id']);
                } else {
                    $todo->categories()->detach();
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $todo,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Todo güncellenirken hata oluştu: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Todo güncellenirken beklenmeyen bir hata oluştu.',
            ], 500);
        }
    }

    /**
     * Bir todonun durumunu günceller.
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,completed,in_progress,cancelled'
        ]);

        $todo = $this->todoService->updateStatus($id, $request->status);

        if (!$todo) {
            return response()->json([
                'status' => 'error',
                'message' => 'Durumu güncellenecek todo bulunamadı.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $todo,
        ]);
    }

    /**
     * Belirli bir todoyu siler.
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->todoService->deleteTodo($id);

        if (!$deleted) {
             return response()->json([
                'status' => 'error',
                'message' => 'Silinecek todo bulunamadı.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Todo başarıyla silindi.',
        ], 204);
    }

    /**
     * Todolar arasında arama yapar.
     */
    public function search(Request $request): JsonResponse
    {
        $q = $request->query('q');

        if (!$q) {
            return response()->json([
                'status' => 'error',
                'message' => 'Arama terimi belirtilmelidir.',
            ], 400);
        }

        $results = $this->todoService->searchTodos($q);

        return response()->json([
            'status' => 'success',
            'data' => $results,
        ]);
    }
}