<?php

use App\Http\Controllers\Api\V1\Admin\Content\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\V1\Admin\Master\DepartmentController as AdminDepartmentController;
use App\Http\Controllers\Api\V1\Admin\Master\OrganizationController as AdminOrganizationController;
use App\Http\Controllers\Api\V1\Admin\Master\OrganizationUserController;
use App\Http\Controllers\Api\V1\Admin\Master\UmkmController as AdminUmkmController;
use App\Http\Controllers\Api\V1\Admin\RBAC\PermissionController;
use App\Http\Controllers\Api\V1\Admin\RBAC\RoleController;
use App\Http\Controllers\Api\V1\Admin\RBAC\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Admin\RBAC\UserRoleController;
use App\Http\Controllers\Api\V1\Advisor\MentoringController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\NotificationController;
use App\Http\Controllers\Api\V1\Auth\OrganizationController as MyOrganizationController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Public\ArticleController as PublicArticleController;
use App\Http\Controllers\Api\V1\Umkm\Machine\MachineController;
use App\Http\Controllers\Api\V1\Umkm\Machine\ReservationController;
use App\Http\Controllers\Api\V1\Umkm\Operation\ProductController;
use App\Http\Controllers\Api\V1\Umkm\Project\ProjectController;
use App\Http\Controllers\Api\V1\Umkm\Strategy\AssessmentController;
use App\Http\Controllers\Api\V1\Umkm\Strategy\BusinessProfileController;
use App\Http\Controllers\Api\V1\Umkm\Strategy\RecommendationController;
use App\Http\Controllers\Api\V1\Umkm\Strategy\TechnicalProfileController;
use App\Http\Controllers\Api\V1\Umkm\Strategy\UmkmController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('articles')->group(function () {
        Route::get('/', [PublicArticleController::class, 'index']);
        Route::get('{slug}', [PublicArticleController::class, 'show']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);

        Route::prefix('profile')->group(function () {
            Route::get('/', [ProfileController::class, 'show']);
            Route::put('/', [ProfileController::class, 'update']);
            Route::put('password', [ProfileController::class, 'updatePassword']);
        });

        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
            Route::post('{id}/read', [NotificationController::class, 'markAsRead']);
        });

        Route::prefix('my/institutions')->group(function () {
            Route::get('/', [MyOrganizationController::class, 'index']);
            Route::get('{organization}', [MyOrganizationController::class, 'show']);
            Route::put('{organization}', [MyOrganizationController::class, 'update']);
        });

        Route::prefix('my/organizations')->group(function () {
            Route::get('/', [MyOrganizationController::class, 'index']);
            Route::get('{organization}', [MyOrganizationController::class, 'show']);
            Route::put('{organization}', [MyOrganizationController::class, 'update']);
        });

        Route::apiResource('umkm', UmkmController::class);

        Route::prefix('umkm/{umkm}')->group(function () {
            Route::prefix('profile')->group(function () {
                Route::get('/', [BusinessProfileController::class, 'show']);
                Route::post('/', [BusinessProfileController::class, 'store']);
            });

            Route::prefix('production-capacities')->group(function () {
                Route::get('/', [TechnicalProfileController::class, 'getProductionCapacities']);
                Route::post('/', [TechnicalProfileController::class, 'storeProductionCapacity']);
            });

            Route::prefix('machine-manuals')->group(function () {
                Route::get('/', [TechnicalProfileController::class, 'getMachineManuals']);
                Route::post('/', [TechnicalProfileController::class, 'storeMachineManual']);
            });

            Route::prefix('products')->group(function () {
                Route::get('/', [ProductController::class, 'index']);
                Route::post('/', [ProductController::class, 'store']);
            });
        });

        Route::prefix('production-capacities')->group(function () {
            Route::get('/', [TechnicalProfileController::class, 'index']);
            Route::post('/', [TechnicalProfileController::class, 'store']);
            Route::put('{capacity}', [TechnicalProfileController::class, 'updateProductionCapacity']);
            Route::delete('{capacity}', [TechnicalProfileController::class, 'destroyProductionCapacity']);
        });

        Route::prefix('machine-manuals')->group(function () {
            Route::get('/', [TechnicalProfileController::class, 'indexMachineManuals']);
            Route::post('/', [TechnicalProfileController::class, 'storeMachineManualGlobal']);
            Route::put('{machine}', [TechnicalProfileController::class, 'updateMachineManual']);
            Route::delete('{machine}', [TechnicalProfileController::class, 'destroyMachineManual']);
        });

        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'indexGlobal']);
            Route::post('/', [ProductController::class, 'storeGlobal']);
            Route::put('{product}', [ProductController::class, 'update']);
            Route::delete('{product}', [ProductController::class, 'destroy']);
        });

        Route::prefix('assessments')->group(function () {
            Route::get('questions', [AssessmentController::class, 'questions']);
            Route::get('/', [AssessmentController::class, 'index']);
            Route::post('/', [AssessmentController::class, 'store']);
            Route::get('{assessment}', [AssessmentController::class, 'show']);
            Route::post('{assessment}/answers', [AssessmentController::class, 'submitAnswers']);
            Route::post('{assessment}/calculate', [AssessmentController::class, 'calculateScore']);
            Route::get('{assessment}/recommendations', [RecommendationController::class, 'index']);
        });

        Route::prefix('projects')->group(function () {
            Route::get('/', [ProjectController::class, 'index']);
            Route::post('/', [ProjectController::class, 'store']);
            Route::get('{project}', [ProjectController::class, 'show']);
            Route::put('{project}', [ProjectController::class, 'update']);
            Route::delete('{project}', [ProjectController::class, 'destroy']);
            Route::post('{project}/iterations', [ProjectController::class, 'storeIteration']);
            Route::post('{project}/notes', [ProjectController::class, 'storeNote']);
        });

        Route::prefix('iterations')->group(function () {
            Route::put('{iteration}', [ProjectController::class, 'updateIteration']);
            Route::post('{iteration}/action-plans', [ProjectController::class, 'storeActionPlan']);
        });

        Route::prefix('action-plans')->group(function () {
            Route::put('{actionPlan}', [ProjectController::class, 'updateActionPlan']);
            Route::post('{actionPlan}/deliverables', [ProjectController::class, 'storeDeliverable']);
        });

        Route::prefix('machines')->group(function () {
            Route::get('/', [MachineController::class, 'index']);
            Route::post('/', [MachineController::class, 'store']);
            Route::get('{machine}', [MachineController::class, 'show']);

            Route::prefix('reservations')->group(function () {
                Route::get('all', [ReservationController::class, 'index']);
                Route::get('incoming', [ReservationController::class, 'incoming']);
                Route::post('/', [ReservationController::class, 'store']);
                Route::post('{reservation}/approve', [ReservationController::class, 'approve']);
            });
        });

        Route::prefix('mentoring')->group(function () {
            Route::get('departments', [MentoringController::class, 'departments']);
            Route::get('requests', [MentoringController::class, 'requests']);
            Route::post('requests', [MentoringController::class, 'createRequest']);
            Route::get('requests/{consultation}', [MentoringController::class, 'show']);
            Route::post('requests/{consultation}/assign-department', [MentoringController::class, 'assignDepartment']);
            Route::post('requests/{consultation}/assign', [MentoringController::class, 'assignMentor']);
            Route::post('requests/{consultation}/sessions', [MentoringController::class, 'createSession']);
            Route::post('requests/{consultation}/complete', [MentoringController::class, 'complete']);
            Route::post('sessions/{session}/notes', [MentoringController::class, 'addNote']);
        });

        Route::prefix('admin')
            ->middleware('permission:access admin panel')
            ->group(function () {
                Route::apiResource('institutions', AdminOrganizationController::class)
                    ->middleware('permission:manage organizations');

                Route::apiResource('organizations', AdminOrganizationController::class)
                    ->middleware('permission:manage organizations');

                Route::apiResource('departments', AdminDepartmentController::class)
                    ->middleware('permission:manage departments');

                Route::apiResource('users', AdminUserController::class)
                    ->middleware('permission:manage users');

                Route::get('umkm', [AdminUmkmController::class, 'index'])
                    ->middleware('permission:view umkm');

                Route::apiResource('roles', RoleController::class)
                    ->middleware('permission:manage roles');

                Route::apiResource('permissions', PermissionController::class)
                    ->middleware('permission:manage permissions');

                Route::prefix('institutions/{organization}/members')
                    ->middleware('permission:manage users')
                    ->group(function () {
                        Route::get('/', [OrganizationUserController::class, 'index']);
                        Route::put('{user}/status', [OrganizationUserController::class, 'updateStatus']);
                        Route::delete('{user}', [OrganizationUserController::class, 'remove']);
                    });

                Route::prefix('organizations/{organization}/members')
                    ->middleware('permission:manage users')
                    ->group(function () {
                        Route::get('/', [OrganizationUserController::class, 'index']);
                        Route::put('{user}/status', [OrganizationUserController::class, 'updateStatus']);
                        Route::delete('{user}', [OrganizationUserController::class, 'remove']);
                    });

                Route::prefix('user-roles')
                    ->middleware('permission:view user roles')
                    ->group(function () {
                        Route::get('/', [UserRoleController::class, 'index']);
                    });

                Route::prefix('users/{user}')->group(function () {
                    Route::get('roles', [UserRoleController::class, 'show'])
                        ->middleware('permission:view user roles');

                    Route::post('roles', [UserRoleController::class, 'assignRole'])
                        ->middleware('permission:assign roles');

                    Route::post('roles/add', [UserRoleController::class, 'addRole'])
                        ->middleware('permission:assign roles');

                    Route::post('roles/remove', [UserRoleController::class, 'removeRole'])
                        ->middleware('permission:assign roles');

                    Route::post('permissions', [UserRoleController::class, 'syncPermission'])
                        ->middleware('permission:assign permissions');
                });

                Route::prefix('articles')->group(function () {
                    Route::get('/', [AdminArticleController::class, 'adminIndex']);
                    Route::post('/', [AdminArticleController::class, 'store']);
                    Route::put('{article}', [AdminArticleController::class, 'update']);
                    Route::delete('{article}', [AdminArticleController::class, 'destroy']);
                });
            });
    });
});
