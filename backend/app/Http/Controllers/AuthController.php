<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException; 

class AuthController extends Controller
{
    /**
     * Yeni kullanıcı kaydı.
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed', 
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken; 

            return response()->json([
                'message' => 'Kullanıcı başarıyla kaydedildi!',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Kayıt sırasında bir hata oluştu.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Kullanıcı girişi.
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Geçersiz giriş bilgileri.',
                ], 401);
            }

            $user = $request->user();
            $token = $user->createToken('auth_token')->plainTextToken; 

            return response()->json([
                'message' => 'Başarıyla giriş yapıldı!',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Giriş sırasında bir hata oluştu.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Kullanıcı çıkışı.
     */
    public function logout(Request $request)
    {
        // Kullanıcının mevcut token'ını iptal et
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Başarıyla çıkış yapıldı!']);
    }

    /**
     * Kimliği doğrulanmış kullanıcı bilgilerini döndürür.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}