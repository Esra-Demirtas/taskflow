<?php

namespace App\Services;

use App\Repositories\TodoRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Todo; // Todo modelini kullanacağımız için import edelim

class TodoService
{
    protected $todoRepository;

    public function __construct(TodoRepository $todoRepository)
    {
        $this->todoRepository = $todoRepository;
    }

    /**
     * Tüm todoları getirir (filtreleme, sıralama ve sayfalama ile).
     * Repositoru zaten kategorileri eager load ediyor.
     */
    public function getAllTodos(array $filters = [], int $limit = 10, string $sort = 'created_at', string $order = 'desc')
    {
        return $this->todoRepository->getAll($filters, $limit, $sort, $order);
    }

    

    /**
     * Belirli bir todoyu ID'sine göre getirir.
     * Repositoru zaten kategorileri eager load ediyor.
     */
    public function getTodoById(int $id)
    {
        return $this->todoRepository->findById($id);
    }

    /**
     * Yeni bir todo oluşturur ve kategorilerini ilişkilendirir.
     */
    public function createTodo(array $data): Todo
    {
        // category_ids'i veri dizisinden ayır, çünkü todo tablosunun sütunu değil.
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']); 

        // Todo'yu oluştur
        $todo = $this->todoRepository->create($data); // TodoRepository'nin create metodunu kullanıyoruz

        // Kategorileri pivot tabloya ekle
        if ($todo && !empty($categoryIds)) {
            $todo->categories()->attach($categoryIds);
        }

        // İlişkili kategorilerle birlikte todo'yu döndür
        $todo->load('categories'); 
        
        return $todo;
    }

    /**
     * Mevcut bir todoyu günceller ve kategorilerini senkronize eder.
     */
    public function updateTodo(int $id, array $data): ?Todo
    {
        // category_ids'i veri dizisinden ayır.
        // Array_key_exists kontrolü, category_ids'in request'te olup olmadığını kontrol eder
        // Böylece eğer frontend category_ids göndermezse sync işlemi çalışmaz.
        $categoryIds = null;
        if (array_key_exists('category_ids', $data)) {
            $categoryIds = $data['category_ids'];
            unset($data['category_ids']); // Veritabanına kaydedilecek ana todo verisinden çıkar
        }

        // Todo'yu güncelle
        $todo = $this->todoRepository->update($id, $data); // TodoRepository'nin update metodunu kullanıyoruz

        // Kategorileri senkronize et
        if ($todo && $categoryIds !== null) { // categoryIds null değilse (yani request'te gönderildiyse)
            if (empty($categoryIds)) { // Eğer boş bir dizi gönderildiyse tüm kategorileri kaldır
                $todo->categories()->detach();
            } else { // Belirtilen kategorilerle senkronize et
                $todo->categories()->sync($categoryIds);
            }
        }

        // Güncellenen todo'yu ilişkili kategorilerle birlikte döndür
        if ($todo) {
            $todo->load('categories');
        }
        
        return $todo;
    }

    /**
     * Bir todonun durumunu günceller.
     * Repositoru zaten kategorileri eager load ediyor.
     */
    public function updateStatus(int $id, string $status): ?Todo
    {
        $todo = $this->todoRepository->updateStatus($id, $status);
        if ($todo) {
             // Tutarlılık için güncellenen todo'yu kategorileriyle birlikte döndür
            $todo->load('categories'); 
        }
        return $todo;
    }

    /**
     * Belirli bir todoyu siler.
     */
    public function deleteTodo(int $id): bool
    {
        return $this->todoRepository->delete($id);
    }

    /**
     * Todolar arasında arama yapar.
     * Repositoru zaten kategorileri eager load ediyor.
     */
    public function searchTodos(string $query)
    {
        return $this->todoRepository->search($query);
    }

    protected function validate(array $data, $id = null)
    {
        $rules = [
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:pending,completed,in_progress,cancelled',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ];

        if ($id) {
            foreach ($rules as $key => $rule) {
                if (str_contains($rule, 'required')) {
                    $rules[$key] = str_replace('required', 'sometimes|required', $rule);
                }
            }
        }


        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}