<?php

namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection; // Laravel koleksiyonları için

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
     *
     * @param int $id Todo ID'si
     * @return \App\Models\Todo|null
     */
    public function findById(int $id): ?Todo
    {
        return $this->model->with('categories')->find($id);
    }

    /**
     * Yeni bir todo oluşturur.
     * Bu metot genellikle sadece todo'nun ana verilerini oluşturur, pivot tablo ilişkilerini değil.
     * İlişkilendirme Controller'da veya Service'de yapılabilir.
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
     * Bu metot genellikle sadece todo'nun ana verilerini günceller, pivot tablo ilişkilerini değil.
     * İlişkilendirme Controller'da veya Service'de yapılabilir.
     *
     * @param int $id Güncellenecek todo ID'si
     * @param array $data Güncelleme verileri
     * @return \App\Models\Todo|null
     */
    public function update(int $id, array $data): ?Todo
    {
        $todo = $this->model->find($id);
        if ($todo) {
            $todo->update($data);
        }
        return $todo; // Eğer bulunamazsa null, bulunursa güncellenmiş model döner
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
        $todo = $this->model->find($id);
        if ($todo) {
            $todo->update(['status' => $status]);
        }
        return $todo; // Eğer bulunamazsa null, bulunursa güncellenmiş model döner
    }

    /**
     * Belirli bir todoyu siler.
     *
     * @param int $id Silinecek todo ID'si
     * @return bool
     */
    public function delete(int $id): bool
    {
        // destroy metodu, model bulunamazsa 0, silinirse 1 döndürür. (bool) ile cast ediyoruz.
        return (bool) $this->model->destroy($id);
    }

    /**
     * Todolar arasında arama yapar.
     * Kategorileri eager load eder.
     *
     * @param string $query Arama sorgusu
     * @return \Illuminate\Pagination\LengthAwarePaginator
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