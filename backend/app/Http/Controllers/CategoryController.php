<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
        // İhtiyaç duyulursa buraya middleware eklenebilir, örn:
        // $this->middleware('auth:sanctum');
    }

    /**
     * GET /api/categories
     * Tüm kategorileri listeler.
     */
    public function index(): JsonResponse
    {
        $categories = $this->service->list();

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategoriler başarıyla listelendi.',
            $categories,
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * GET /api/categories/{id}
     * Belirli bir kategoriyi ID'sine göre getirir.
     */
    public function show($id): JsonResponse
    {
        $category = $this->service->getById($id);

        if (!$category) {
            // Kaynak bulunamadığında ModelNotFoundException fırlatıyoruz.
            // Bu istisna Handler.php tarafından yakalanacak ve 404 döndürecek.
            throw new ModelNotFoundException('Kategori bulunamadı.');
        }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategori detayları getirildi.',
            $category,
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * POST /api/categories
     * Yeni bir kategori oluşturur.
     */
    public function store(Request $request): JsonResponse
    {
        // Renk alanı için validasyon kuralı eklendi
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'color' => 'nullable|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/', // Renk validasyonu
        ]);

        $category = $this->service->create($validatedData);

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategori başarıyla oluşturuldu.',
            $category,
            Response::HTTP_CREATED // 201 Created
        );
    }

    /**
     * PUT /api/categories/{id}
     * Mevcut bir kategoriyi günceller.
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Renk alanı için validasyon kuralı eklendi
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $id,
            'color' => 'nullable|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/', // Renk validasyonu
        ]);

        $category = $this->service->update($id, $validatedData);

        if (!$category) {
            // Kaynak bulunamadığında ModelNotFoundException fırlatıyoruz.
            throw new ModelNotFoundException('Güncellenecek kategori bulunamadı.');
        }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategori başarıyla güncellendi.',
            $category,
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * DELETE /api/categories/{id}
     * Belirli bir kategoriyi siler.
     */
    public function destroy($id): JsonResponse
    {
        $deleted = $this->service->delete($id);

        if (!$deleted) {
            // Kaynak bulunamadığında ModelNotFoundException fırlatıyoruz.
            throw new ModelNotFoundException('Silinecek kategori bulunamadı.');
        }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategori başarıyla silindi.',
            null, // Silme işleminde genellikle veri dönülmez
            Response::HTTP_NO_CONTENT // 204 No Content
        );
    }

    /**
     * GET /api/categories/{id}/todos
     * Bir kategoriye ait tüm todoları getirir.
     */
    public function todos($id): JsonResponse
    {
        // Servis katmanında kategori bulunamazsa zaten bir istisna fırlatılabilir.
        // Eğer servis null dönüyorsa, burada da ModelNotFoundException fırlatabiliriz.
        $todos = $this->service->getTodos($id);

        // getTodos metodunuz CategoryService içinde kategori bulunamazsa null dönüyorsa:
        // if ($todos === null) {
        //     throw new ModelNotFoundException('Kategoriye ait todolar bulunamadı veya kategori yok.');
        // }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kategoriye ait todolar listelendi.',
            $todos,
            Response::HTTP_OK // 200 OK
        );
    }
}