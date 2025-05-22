<?php

namespace App\Http\Controllers;

use App\Services\StatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    protected StatsService $statsService;

    public function __construct(StatsService $statsService)
    {
        $this->statsService = $statsService;
    }

    // GET /api/stats/todos
    public function todos(): JsonResponse
    {
        $data = $this->statsService->getTodosStatsByStatus();

        return response()->json([
            'status' => 'success',
            'data' => $data,
            'message' => 'Todo sayıları durum bazında başarıyla getirildi.'
        ], 200);
    }

    // GET /api/stats/priorities
    public function priorities(): JsonResponse
    {
        $data = $this->statsService->getTodosStatsByPriority();

        return response()->json([
            'status' => 'success',
            'data' => $data,
            'message' => 'Todo sayıları öncelik bazında başarıyla getirildi.'
        ], 200);
    }
}
