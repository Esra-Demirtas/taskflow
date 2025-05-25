<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        // Eğer istek bir API isteği ise (genellikle Accept header'ı application/json içerir)
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $exception);
        }

        // Web istekleri için Laravel'in varsayılan hata yönetimini kullan
        return parent::render($request, $exception);
    }

    /**
     * Handle API exceptions and return a consistent JSON response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiException($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {
            // 422: Doğrulama Hataları
            return $this->invalidJson($request, $exception);
        }

        if ($exception instanceof ModelNotFoundException) {
            // 404: Kaynak Bulunamadı (Eloquent modeli için)
            return $this->errorResponse(
                'error',
                'Kaynak bulunamadı.',
                null,
                404
            );
        }

        if ($exception instanceof NotFoundHttpException) {
            // 404: Kaynak Bulunamadı (Genel URL veya Route hatası)
            return $this->errorResponse(
                'error',
                'İstek yapılan kaynak bulunamadı.',
                null,
                404
            );
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            // 405: Method Not Allowed (Desteklenmeyen HTTP Metodu)
            return $this->errorResponse(
                'error',
                'Bu kaynak için izin verilmeyen HTTP metodu.',
                null,
                405
            );
        }

        if ($exception instanceof AuthenticationException) {
            // 401: Yetkilendirme Hatası (Authentication - Giriş yapılmamış)
            return $this->unauthenticated($request, $exception);
        }

        if ($exception instanceof AuthorizationException) {
            // 403: Erişim Engellendi (Authorization - İzin yok)
            return $this->errorResponse(
                'error',
                'Bu işlemi gerçekleştirmeye yetkiniz yok.',
                null,
                403
            );
        }

        if ($exception instanceof HttpException) {
            // Diğer HTTP hataları (örneğin 403, 400 vb. manuel fırlatılanlar)
            return $this->errorResponse(
                'error',
                $exception->getMessage() ?: 'Bir HTTP hatası oluştu.',
                null,
                $exception->getStatusCode()
            );
        }

        // Tüm diğer beklenmedik hatalar için 500 Sunucu Hatası
        return $this->errorResponse(
            'error',
            'Beklenmedik bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
            config('app.debug') ? $exception->getMessage() : null, // Debug modunda hatayı göster, aksi takdirde gizle
            500
        );
    }

    /**
     * Prepare a JSON response for a validation exception.
     * Overrides Laravel's default behavior to match your desired format.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Validation\ValidationException  $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function invalidJson($request, ValidationException $exception)
    {
        $errors = [];
        foreach ($exception->errors() as $field => $messages) {
            foreach ($messages as $message) {
                $errors[] = [
                    'field' => $field,
                    'message' => $message,
                ];
            }
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Doğrulama hatası.',
            'errors' => $errors,
        ], 422);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     * Overrides Laravel's default behavior to match your desired format.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $this->errorResponse(
            'error',
            'Bu işlem için oturum açmanız gerekmektedir.',
            null,
            401
        );
    }

    /**
     * Generates a consistent error JSON response.
     *
     * @param string $status 'success' or 'error'
     * @param string $message Main message describing the response
     * @param mixed $data Optional data to include in the response (e.g., error details in debug mode)
     * @param int $statusCode HTTP status code
     * @param array $errors Optional array of error details
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($status, $message, $data = null, $statusCode = 500, $errors = [])
    {
        $response = [
            'status' => $status,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Generates a consistent success JSON response.
     * You can use this method in your controllers for successful operations.
     *
     * @param string $message Main message describing the response
     * @param mixed $data Data payload for successful responses
     * @param int $statusCode HTTP status code (default 200)
     * @param array $meta Optional meta data (e.g., pagination)
     * @return \Illuminate\Http\JsonResponse
     */
}