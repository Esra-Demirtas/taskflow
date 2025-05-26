<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TodoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Todo;
use App\Models\Category;

use App\Traits\ApiResponse;
use Symfony\Component\HttpFoundation\Response;

class TodoController extends Controller
{
    use ApiResponse;

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
        // 'q' filtresini de request'ten alıyoruz
        $filters = $request->only(['status', 'priority', 'q']);
        $limit = $request->get('limit', 10); // Varsayılan limit 10
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');

        $todos = $this->todoService->getAllTodos($filters, $limit, $sort, $order);

        return $this->successResponse(
            'Todolar başarıyla listelendi.',
            $todos->items(),
            Response::HTTP_OK,
            [
                'pagination' => [
                    'total'        => $todos->total(),
                    'per_page'     => $todos->perPage(),
                    'current_page' => $todos->currentPage(),
                    'last_page'    => $todos->lastPage(),
                    'from'         => $todos->firstItem(),
                    'to'           => $todos->lastItem(),
                    'next_page_url'=> $todos->nextPageUrl(), // Sonraki sayfa URL'si
                    'prev_page_url'=> $todos->previousPageUrl(), // Önceki sayfa URL'si
                ]
            ]
        );
    }

    /**
     * Belirli bir todoyu ID'sine göre getirir.
     */
    public function show($id): JsonResponse
    {
        $todo = $this->todoService->getTodoById($id);

        if (!$todo) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Todo bulunamadı.');
        }

        return $this->successResponse(
            'Todo detayları getirildi.',
            $todo,
            Response::HTTP_OK
        );
    }

    /**
     * Yeni bir todo oluşturur.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ]);

        $validatedData['user_id'] = Auth::id();

        $todo = $this->todoService->createTodo($validatedData);

        if (isset($validatedData['category_ids']) && count($validatedData['category_ids']) > 0) {
            $todo->categories()->sync($validatedData['category_ids']);
        }

        $todo->load('categories');

        return $this->successResponse(
            'Todo başarıyla oluşturuldu.',
            $todo,
            Response::HTTP_CREATED
        );
    }

    /**
     * Mevcut bir todoyu günceller.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'sometimes|required|in:pending,in_progress,completed,cancelled',
            'priority' => 'sometimes|required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ]);

        $todo = $this->todoService->updateTodo($id, $validatedData);

        if (!$todo) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Güncellenecek todo bulunamadı.');
        }

        if (array_key_exists('category_ids', $validatedData)) {
            if ($validatedData['category_ids'] === null || count($validatedData['category_ids']) === 0) {
                $todo->categories()->detach();
            } else {
                $todo->categories()->sync($validatedData['category_ids']);
            }
        }

        $todo->load('categories');

        return $this->successResponse(
            'Todo başarıyla güncellendi.',
            $todo,
            Response::HTTP_OK
        );
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
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Durumu güncellenecek todo bulunamadı.');
        }

        $todo->load('categories');

        return $this->successResponse(
            'Todo durumu başarıyla güncellendi.',
            $todo,
            Response::HTTP_OK
        );
    }

    /**
     * Belirli bir todoyu siler.
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->todoService->deleteTodo($id);

        if (!$deleted) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Silinecek todo bulunamadı.');
        }

        return $this->successResponse(
            'Todo başarıyla silindi.',
            null,
            Response::HTTP_NO_CONTENT
        );
    }

    /**
     * Todolar arasında arama yapar ve sayfalı sonuç döndürür.
     */
    public function search(Request $request): JsonResponse
    {
        $q = $request->query('q');
        $limit = $request->get('limit', 10); // Arama sonuçları için de sayfalama limiti

        if (!$q) {
            return $this->errorResponse(
                'Arama terimi belirtilmelidir.',
                Response::HTTP_BAD_REQUEST
            );
        }

        // searchTodos metoduna limiti de gönderiyoruz
        $results = $this->todoService->searchTodos($q, $limit);

        return $this->successResponse(
            'Arama sonuçları başarıyla listelendi.',
            $results->items(),
            Response::HTTP_OK,
            [
                'pagination' => [
                    'total'        => $results->total(),
                    'per_page'     => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page'    => $results->lastPage(),
                    'from'         => $results->firstItem(),
                    'to'           => $results->lastItem(),
                    'next_page_url'=> $results->nextPageUrl(),
                    'prev_page_url'=> $results->previousPageUrl(),
                ]
            ]
        );
    }
}