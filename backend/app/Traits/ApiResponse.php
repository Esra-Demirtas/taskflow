<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Generates a consistent success JSON response.
     *
     * @param string $message Main message describing the response
     * @param mixed $data Data payload for successful responses
     * @param int $statusCode HTTP status code (default 200)
     * @param array $meta Optional meta data (e.g., pagination)
     * @return JsonResponse
     */
    protected function successResponse($message = 'İşlem başarıyla tamamlandı.', $data = null, $statusCode = 200, $meta = []): JsonResponse
    {
        $response = [
            'status' => 'success',
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Generates a consistent error JSON response (for specific scenarios in controllers, though Handler.php is primary for errors).
     * This can be used for client-side validation errors not caught by Laravel's ValidationException.
     *
     * @param string $message Main message describing the response
     * @param int $statusCode HTTP status code
     * @param array $errors Optional array of error details
     * @return JsonResponse
     */
    protected function errorResponse($message = 'Bir hata oluştu.', $statusCode = 500, $errors = []): JsonResponse
    {
        $response = [
            'status' => 'error',
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }
}