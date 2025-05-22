<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $model;

    public function __construct(User $user)
    {
        $this->model = $user;
    }

    // Tüm kullanıcıları sayfalı şekilde getir
    public function getAll(int $limit = 10)
    {
        return $this->model->paginate(min($limit, 50)); // limit max 50
    }

    // ID ile kullanıcı bul
    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    // Yeni kullanıcı oluştur
    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    // Kullanıcı güncelle
    public function update(int $id, array $data): bool
    {
        $user = $this->findById($id);
        if (!$user) {
            return false;
        }
        return $user->update($data);
    }

    // Kullanıcı sil (soft delete)
    public function delete(int $id): bool
    {
        $user = $this->findById($id);
        if (!$user) {
            return false;
        }
        return $user->delete();
    }
}
