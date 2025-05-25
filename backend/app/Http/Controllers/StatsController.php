<?php

namespace App\Http\Controllers;

use App\Services\StatsService;
use Illuminate\Http\JsonResponse;

use App\Traits\ApiResponse; // <-- Bu satırı ekleyin
use Symfony\Component\HttpFoundation\Response; // <-- HTTP durum kodları için bu satırı ekleyin

class StatsController extends Controller
{
    use ApiResponse; // <-- Bu satırı ekleyin

    protected StatsService $statsService;

    public function __construct(StatsService $statsService)
    {
        $this->statsService = $statsService;
        // İstatistikler genellikle herkese açık olabilir veya belirli bir yetkilendirme gerektirebilir.
        // İhtiyaç duyulursa buraya middleware eklenebilir, örn:
        // $this->middleware('auth:sanctum');
    }

    /**
     * GET /api/stats/todos
     * Todo sayılarını duruma göre getirir.
     */
    public function todos(): JsonResponse
    {
        $data = $this->statsService->getTodosStatsByStatus();

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Todo sayıları durum bazında başarıyla getirildi.',
            $data,
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * GET /api/stats/priorities
     * Todo sayılarını önceliğe göre getirir.
     */
    public function priorities(): JsonResponse
    {
        $data = $this->statsService->getTodosStatsByPriority();

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Todo sayıları öncelik bazında başarıyla getirildi.',
            $data,
            Response::HTTP_OK // 200 OK
        );
    }
}