<?php

namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

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
     *
     * @param array $filters Filtreleme kriterleri (status, priority, q)
     * @param int $limit Sayfalama limiti
     * @param string $sort Sıralama sütunu
     * @param string $order Sıralama yönü (asc/desc)
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAll(array $filters = [], int $limit = 10, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('categories');

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
     *
     * @param int $id Todo ID'si
     * @return \App\Models\Todo|null
     */
    public function findById($id): ?Todo
    {
        return $this->model->with('categories')->where('id', $id)->first();
    }


    /**
     * Yeni bir todo oluşturur.
     *
     * @param array $data Oluşturulacak todo verileri
     * @return \App\Models\Todo
     */
    public function create(array $data): Todo
    {
        return $this->model->create($data);
    }

    /**
     * Mevcut bir todoyu günceller.
     *
     * @param int $id Güncellenecek todo ID'si
     * @param array $data Güncelleme verileri
     * @return \App\Models\Todo|null
     */
    public function update(int $id, array $data): ?Todo
    {
        /** @var Todo|null $todo */
        $todo = $this->model->find($id);

        if ($todo) {
            $todo->update($data);
        }
        return $todo;
    }

    /**
     * Belirli bir todonun durumunu günceller.
     *
     * @param int $id Durumu güncellenecek todo ID'si
     * @param string $status Yeni durum
     * @return \App\Models\Todo|null
     */
    public function updateStatus(int $id, string $status): ?Todo
    {
        /** @var Todo|null $todo */
        $todo = $this->model->find($id);

        if ($todo) {
            $todo->update(['status' => $status]);
        }
        return $todo;
    }

    /**
     * Belirli bir todoyu siler.
     *
     * @param int $id Silinecek todo ID'si
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Todolar arasında arama yapar.
     * Kategorileri eager load eder.
     *
     * @param string $query Arama sorgusu
     * @param int $limit Sayfalama limiti
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function search(string $query, int $limit = 10): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('categories')
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->paginate($limit);
    }
}