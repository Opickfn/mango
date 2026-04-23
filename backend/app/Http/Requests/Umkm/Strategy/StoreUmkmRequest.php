<?php

namespace App\Http\Requests\Umkm\Strategy;

use Illuminate\Foundation\Http\FormRequest;

class StoreUmkmRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() !== null;
    }

    public function rules()
    {
        return [
            'umkm_organization_id' => ['required', 'exists:umkm_organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'owner_name' => ['required', 'string', 'max:255'],
            'sector' => ['required', 'string', 'max:100'],
            'nib' => ['required', 'string', 'max:100'],
            'established_year' => ['required', 'integer', 'min:1900', 'max:' . date('Y')],
            'employee_count' => ['required', 'integer', 'min:0'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'main_product' => ['required', 'string', 'max:255'],
            'annual_revenue' => ['required', 'string', 'max:100'],
            'market_target' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('organization_id') && ! $this->filled('umkm_organization_id')) {
            $this->merge([
                'umkm_organization_id' => $this->organization_id,
            ]);
        }
    }
}
