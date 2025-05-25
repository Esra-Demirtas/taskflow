<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/categories
     */
    public function index()
    {
        $categories = $this->service->list();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ], 200);
    }

    /**
     * GET /api/categories/{id}
     */
    public function show($id)
    {
        $category = $this->service->getById($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori bulunamadı',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $category,
        ], 200);
    }

    /**
     * POST /api/categories
     */
    public function store(Request $request)
    {
        try {
            $category = $this->service->create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori oluşturuldu',
                'data' => $category,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    /**
     * PUT /api/categories/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $category = $this->service->update($id, $request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori güncellendi',
                'data' => $category,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * DELETE /api/categories/{id}
     */
    public function destroy($id)
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori silindi',
            ], 204);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * GET /api/categories/{id}/todos
     */
    public function todos($id)
    {
        try {
            $todos = $this->service->getTodos($id);

            return response()->json([
                'status' => 'success',
                'data' => $todos,
            ], 200);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }
}
