<?php

namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Pagination\LengthAwarePaginator;

class TodoRepository
{
    protected $model;

    public function __construct(Todo $model)
    {
        $this->model = $model;
    }

    /**
     * Tüm todoları getirir (filtreleme, sıralama ve sayfalama ile).
     * Kategorileri eager load eder.
     */
    public function getAll(array $filters = [], int $limit = 10, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        $query->with('categories');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['q'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['q'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['q'] . '%');
            });
        }

        return $query->orderBy($sort, $order)->paginate($limit);
    }

    /**
     * Belirli bir todoyu ID'sine göre getirir.
     * Kategorileri eager load eder.
     */
    public function findById(int $id): ?Todo
    {
        return $this->model->with('categories')->find($id);
    }

    /**
     * Yeni bir todo oluşturur.
     * Bu metot genellikle sadece todo'nun ana verilerini oluşturur, pivot tablo ilişkilerini değil.
     * İlişkilendirme Controller'da veya Service'de yapılabilir.
     */
    public function create(array $data): Todo
    {
        return $this->model->create($data);
    }

    /**
     * Mevcut bir todoyu günceller.
     * Bu metot genellikle sadece todo'nun ana verilerini günceller, pivot tablo ilişkilerini değil.
     * İlişkilendirme Controller'da veya Service'de yapılabilir.
     */
    public function update(int $id, array $data): ?Todo
    {
        $todo = $this->model->find($id);
        if ($todo) {
            $todo->update($data);
        }
        return $todo;
    }

    /**
     * Belirli bir todonun durumunu günceller.
     */
    public function updateStatus(int $id, string $status): ?Todo
    {
        $todo = $this->model->find($id);
        if ($todo) {
            $todo->update(['status' => $status]);
        }
        return $todo;
    }

    /**
     * Belirli bir todoyu siler.
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Todolar arasında arama yapar.
     * Kategorileri eager load eder.
     */
    public function search(string $query): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('categories') 
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->paginate(10);
    }
}