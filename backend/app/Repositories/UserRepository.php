<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator; // Bu satırı ekleyin

class UserRepository
{
    protected $model;

    public function __construct(User $user)
    {
        $this->model = $user;
    }

    /**
     * Tüm kullanıcıları sayfalı şekilde getirir.
     *
     * @param int $limit Sayfalama limiti
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAll(int $limit = 10): LengthAwarePaginator
    {
        // Limit 50'yi geçmesin, aksi takdirde 50 olarak ayarla
        return $this->model->paginate(min($limit, 50));
    }

    /**
     * ID ile kullanıcı bulur.
     *
     * @param int $id Kullanıcı ID'si
     * @return \App\Models\User|null
     */
    public function findById(int $id): ?User
    {
        // Seçenek 3: where()->first() kullanımı
        return $this->model->where('id', $id)->first();
    }

    /**
     * Yeni kullanıcı oluşturur.
     *
     * @param array $data Oluşturulacak kullanıcı verileri
     * @return \App\Models\User
     */
    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    /**
     * Kullanıcıyı günceller.
     *
     * @param int $id Güncellenecek kullanıcı ID'si
     * @param array $data Güncelleme verileri
     * @return bool Güncelleme başarılı ise true, aksi halde false
     */
    public function update(int $id, array $data): bool
    {
        $user = $this->findById($id);
        if (!$user) {
            return false;
        }
        return $user->update($data); // Eloquent'in update metodu boolean döndürür
    }

    /**
     * Kullanıcıyı siler (soft delete).
     *
     * @param int $id Silinecek kullanıcı ID'si
     * @return bool Silme başarılı ise true, aksi halde false
     */
    public function delete(int $id): bool
    {
        $user = $this->findById($id);
        if (!$user) {
            return false;
        }
        return $user->delete(); // Eloquent'in delete metodu boolean döndürür
    }
}