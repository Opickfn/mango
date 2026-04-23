<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="MANGO API Documentation",
 *      description="API documentation for MANGO - Textile & UMKM Management System",
 *      @OA\Contact(
 *          email="admin@mango.com"
 *      ),
 * )
 *
 * @OA\Server(
 *      url="/api",
 *      description="Primary API Server"
 * )
 *
 * @OA\SecurityScheme(
 *     type="apiKey",
 *     in="cookie",
 *     securityScheme="cookieAuth",
 *     name="XSRF-TOKEN"
 * )
 */
abstract class Controller
{
    use ApiResponse, \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
}
