<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    // GET /api/users
    public function index(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $users = $this->userService->getAllUsers($limit);

        return response()->json([
            'status' => 'success',
            'data' => $users,
            'meta' => [
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ]
            ]
        ]);
    }

    // GET /api/users/{id}
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kullanıcı bulunamadı'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    // POST /api/users
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->userService->createUser($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla oluşturuldu',
            'data' => $user
        ], 201);
    }

    // PUT /api/users/{id}
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $updated = $this->userService->updateUser($id, $validated);

        if (!$updated) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kullanıcı bulunamadı veya güncellenemedi',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla güncellendi',
        ]);
    }

    // DELETE /api/users/{id}
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userService->deleteUser($id);

        if (!$deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kullanıcı bulunamadı veya silinemedi',
            ], 404);
        }

        return response()->json(null, 204);
    }

}
