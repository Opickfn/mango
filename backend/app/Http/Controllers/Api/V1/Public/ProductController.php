<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Umkm\Operation\ProductResource;
use App\Models\Umkm\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProductController extends Controller
{
    /**
     * Display a listing of Products.
     */
    public function index(Request $request)
    {
        try {
            $query = Product::query()
                ->where('is_active', true)
                ->with('umkm');

            if ($search = $request->get('search')) {
                $query->where('name', 'like', "%{$search}%");
            }

            $perPage = min((int) $request->get('per_page', 12), 100);

            return ProductResource::collection($query->paginate($perPage));
        } catch (Throwable $e) {
            Log::error('Public Product index error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Failed to fetch products'], 500);
        }
    }

    /**
     * Display the specified Product by slug or uuid.
     */
    public function show(string $identifier)
    {
        try {
            $product = Product::query()
                ->where('is_active', true)
                ->where(function ($query) use ($identifier) {
                    $query->where('slug', $identifier)
                        ->orWhere('uuid', $identifier);
                })
                ->with('umkm')
                ->firstOrFail();

            return new ProductResource($product);
        } catch (Throwable $e) {
            Log::error('Public Product show error', [
                'identifier' => $identifier,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Product not found'], 404);
        }
    }
}
