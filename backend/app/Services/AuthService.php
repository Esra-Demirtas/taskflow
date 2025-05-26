<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Yeni bir kullanıcı kaydı oluşturur.
     *
     * @param array $data Kullanıcı verileri (name, email, password)
     * @return array Kullanıcı modeli ve API token'ı
     */
    public function register(array $data): array
    {
        /** @var \App\Models\User $user */ // Intelephense için tip ipucu
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Kullanıcı girişi yapar ve API token'ı döndürür.
     *
     * @param string $email
     * @param string $password
     * @return array|null Kullanıcı modeli ve API token'ı veya kimlik doğrulama başarısız olursa null
     */
    public function login(string $email, string $password): ?array
    {
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            return null; // Kimlik doğrulama başarısız
        }

        /** @var \App\Models\User $user */ // Intelephense için tip ipucu
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Kullanıcının oturumunu kapatır (tüm token'larını iptal eder).
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Kimliği doğrulanmış kullanıcının bilgilerini getirir.
     *
     * @param \App\Models\User $user
     * @return \App\Models\User
     */
    public function getAuthenticatedUser(User $user): User
    {
        return $user;
    }
}
