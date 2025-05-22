<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    protected $userRepo;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepo = $userRepository;
    }

    // Tüm kullanıcıları getir
    public function getAllUsers(int $limit = 10)
    {
        return $this->userRepo->getAll($limit);
    }

    // Tek kullanıcıyı getir
    public function getUserById(int $id)
    {
        return $this->userRepo->findById($id);
    }

    // Yeni kullanıcı oluştur (şifreyi hashleyerek)
    public function createUser(array $data)
    {
        if (empty($data['password'])) {
            throw ValidationException::withMessages(['password' => 'Şifre zorunludur']);
        }

        $data['password'] = Hash::make($data['password']);
        return $this->userRepo->create($data);
    }

    // Kullanıcı güncelle
    public function updateUser(int $id, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userRepo->update($id, $data);
    }

    // Kullanıcı sil
    public function deleteUser(int $id)
    {
        return $this->userRepo->delete($id);
    }
}
