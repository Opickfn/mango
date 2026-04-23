<?php

namespace App\Http\Requests\Umkm\Operation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() !== null;
    }

    public function rules()
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'sku' => [
                'nullable',
                'string',
                'max:100',
            ],

            'unit' => [
                'nullable',
                'string',
                'max:50',
            ],

            'price' => [
                'sometimes',
                'numeric',
                'min:0',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }

        if ($this->sku) {
            $this->merge([
                'sku' => trim($this->sku),
            ]);
        }
    }
}


