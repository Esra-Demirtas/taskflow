<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:100',
            'color' => ['nullable', 'regex:/^#[A-Fa-f0-9]{6}$/'],
        ];
    }
}
