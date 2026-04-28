<?php

namespace App\Http\Requests\Admin\Master;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstitutionRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()?->hasAnyRole(['super_admin', 'admin', 'upt']);
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['name' => trim($this->name)]);
        }

        if ($this->email) {
            $this->merge(['email' => strtolower($this->email)]);
        }
    }
}
