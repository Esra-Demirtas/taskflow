<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // JsonResponse tip bildirimi için
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Traits\ApiResponse; // <-- Bu satırı ekleyin
use Symfony\Component\HttpFoundation\Response; // <-- HTTP durum kodları için bu satırı ekleyin
use Illuminate\Database\Eloquent\ModelNotFoundException; // Kaynak bulunamadığında fırlatmak için

class UserController extends Controller
{
    use ApiResponse; // <-- Bu satırı ekleyin

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        // Eğer kullanıcı yönetimi sadece adminlere açıksa middleware ekleyebilirsiniz
        // $this->middleware('auth:sanctum');
        // $this->middleware('can:manage-users'); // Laravel yetkilendirme (authorization) kullanıyorsanız
    }

    /**
     * GET /api/users
     * Tüm kullanıcıları listeler (sayfalama ile).
     */
    public function index(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $users = $this->userService->getAllUsers($limit);

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kullanıcılar başarıyla listelendi.',
            $users->items(), // Sayfalama verilerini ayırıp sadece öğeleri gönderiyoruz
            Response::HTTP_OK, // 200 OK
            [
                'pagination' => [
                    'total'        => $users->total(),
                    'per_page'     => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page'    => $users->lastPage(),
                    'from'         => $users->firstItem(),
                    'to'           => $users->lastItem(),
                ]
            ]
        );
    }

    /**
     * GET /api/users/{id}
     * Belirli bir kullanıcıyı ID'sine göre getirir.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            // Kaynak bulunamadığında ModelNotFoundException fırlatıyoruz.
            // Bu istisna Handler.php tarafından yakalanacak ve 404 döndürecek.
            throw new ModelNotFoundException('Kullanıcı bulunamadı.');
        }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kullanıcı detayları getirildi.',
            $user,
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * POST /api/users
     * Yeni bir kullanıcı oluşturur.
     * StoreUserRequest form request'i doğrulama ve hata yönetimini sağlar.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        // Form Request'teki validated() metodu otomatik olarak doğrulanmış veriyi döner.
        // Doğrulama hatası olursa ValidationException Handler.php tarafından yakalanır.
        $validated = $request->validated();

        $user = $this->userService->createUser($validated);

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kullanıcı başarıyla oluşturuldu.',
            $user,
            Response::HTTP_CREATED // 201 Created
        );
    }

    /**
     * PUT /api/users/{id}
     * Mevcut bir kullanıcıyı günceller.
     * UpdateUserRequest form request'i doğrulama ve hata yönetimini sağlar.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        // Form Request'teki validated() metodu otomatik olarak doğrulanmış veriyi döner.
        $validated = $request->validated();

        $updatedUser = $this->userService->updateUser($id, $validated);

        if (!$updatedUser) {
            // Kullanıcı bulunamazsa veya güncellenemezse (service'den false dönerse) ModelNotFoundException fırlatıyoruz.
            throw new ModelNotFoundException('Kullanıcı bulunamadı veya güncellenemedi.');
        }

        // Güncellenen kullanıcıyı döndürmek isterseniz, UserService'den güncellenmiş modeli döndürmelisiniz.
        // Eğer UserService sadece boolean dönüyorsa ve güncellenmiş modeli istiyorsanız,
        // ya UserService'i değiştirin ya da burada tekrar sorgulayın.
        // Örnek: $user = $this->userService->getUserById($id); // Güncellenmiş modeli almak için

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kullanıcı başarıyla güncellendi.',
            $updatedUser, // Varsayalım ki $updatedUser artık güncellenmiş modeli döndürüyor. Eğer boolean ise null geçilebilir.
            Response::HTTP_OK // 200 OK
        );
    }

    /**
     * DELETE /api/users/{id}
     * Belirli bir kullanıcıyı siler.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userService->deleteUser($id);

        if (!$deleted) {
            // Kullanıcı bulunamazsa veya silinemezse (service'den false dönerse) ModelNotFoundException fırlatıyoruz.
            throw new ModelNotFoundException('Kullanıcı bulunamadı veya silinemedi.');
        }

        // API Response Trait'ini kullanarak başarılı yanıt döndür
        return $this->successResponse(
            'Kullanıcı başarıyla silindi.',
            null, // Silme işleminde genellikle veri dönülmez
            Response::HTTP_NO_CONTENT // 204 No Content
        );
    }
}