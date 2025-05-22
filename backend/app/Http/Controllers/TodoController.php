<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TodoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\TodoResource;
use Illuminate\Validation\ValidationException;

class TodoController extends Controller
{
    protected $todoService;

    public function __construct(TodoService $todoService)
    {
        $this->todoService = $todoService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['page', 'limit', 'sort', 'order', 'status', 'priority']);
        $todos = $this->todoService->getAllTodos($filters);

        return response()->json([
            'status' => 'success',
            'data' => $todos,
        ]);
    }

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

    public function store(Request $request): JsonResponse
    {
        try {
            $todo = $this->todoService->createTodo($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $todo,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $todo = $this->todoService->updateTodo($id, $request->all());

            return response()->json([
                'status' => 'success',
                'data' => $todo,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,completed,in_progress'
        ]);

        $todo = $this->todoService->updateStatus($id, $request->status);

        return response()->json([
            'status' => 'success',
            'data' => $todo,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $deleted = $this->todoService->deleteTodo($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Todo başarıyla silindi.',
        ], 204);
    }

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
