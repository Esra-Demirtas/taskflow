<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Yetki kontrolü burada yapılabilir
        return true;
    }

    public function rules(): array
    {
        // $this->route('user') ile route parametresinden id alabiliriz.
        $userId = $this->route('user');

        return [
            'name' => 'sometimes|required|string|min:3|max:100',
            'email' => 'sometimes|required|email|unique:users,email,' . $userId,
            'password' => 'sometimes|string|min:6',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'İsim alanı zorunludur.',
            'email.required' => 'Email alanı zorunludur.',
            'email.email' => 'Geçerli bir email adresi giriniz.',
            'email.unique' => 'Bu email adresi zaten kayıtlı.',
            'password.min' => 'Şifre en az 6 karakter olmalıdır.',
        ];
    }
}
