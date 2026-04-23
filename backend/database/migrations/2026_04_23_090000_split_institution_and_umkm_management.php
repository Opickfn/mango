<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('organizations') && ! Schema::hasTable('institutions')) {
            Schema::rename('organizations', 'institutions');
        }

        if (Schema::hasTable('organization_user') && ! Schema::hasTable('institution_user')) {
            Schema::rename('organization_user', 'institution_user');
        }

        if (Schema::hasTable('departments') && Schema::hasColumn('departments', 'organization_id') && ! Schema::hasColumn('departments', 'institution_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->renameColumn('organization_id', 'institution_id');
            });
        }

        if (Schema::hasTable('institution_user') && Schema::hasColumn('institution_user', 'organization_id') && ! Schema::hasColumn('institution_user', 'institution_id')) {
            Schema::table('institution_user', function (Blueprint $table) {
                $table->renameColumn('organization_id', 'institution_id');
            });
        }

        if (Schema::hasTable('consultation_requests') && Schema::hasColumn('consultation_requests', 'organization_id') && ! Schema::hasColumn('consultation_requests', 'institution_id')) {
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->renameColumn('organization_id', 'institution_id');
            });
        }

        if (Schema::hasTable('umkms') && Schema::hasColumn('umkms', 'managed_by_organization_id') && ! Schema::hasColumn('umkms', 'managed_by_institution_id')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->renameColumn('managed_by_organization_id', 'managed_by_institution_id');
            });
        }

        if (! Schema::hasTable('umkm_organizations')) {
            Schema::create('umkm_organizations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('upt_id')->constrained('institutions')->cascadeOnDelete();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('address')->nullable();
                $table->string('city')->nullable();
                $table->string('province')->nullable();
                $table->string('postal_code', 10)->nullable();
                $table->string('logo')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (Schema::hasTable('umkms') && ! Schema::hasColumn('umkms', 'umkm_organization_id')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->foreignId('umkm_organization_id')
                    ->nullable()
                    ->after('managed_by_institution_id')
                    ->constrained('umkm_organizations')
                    ->nullOnDelete();
            });
        }

        if (Schema::hasTable('umkm_organizations') && Schema::hasColumn('umkm_organizations', 'user_id') && ! Schema::hasColumn('umkm_organizations', 'upt_id')) {
            Schema::table('umkm_organizations', function (Blueprint $table) {
                $table->foreignId('upt_id')->nullable()->after('id')->constrained('institutions')->nullOnDelete();
            });
        }

        if (Schema::hasTable('umkms') && Schema::hasTable('umkm_organizations')) {
            $umkms = DB::table('umkms')->select('id', 'user_id', 'name', 'managed_by_institution_id', 'is_active', 'created_at', 'updated_at')->get();

            foreach ($umkms as $umkm) {
                $existingId = DB::table('umkm_organizations')
                    ->where('name', $umkm->name)
                    ->where('upt_id', $umkm->managed_by_institution_id)
                    ->value('id');

                if (! $existingId) {
                    $existingId = DB::table('umkm_organizations')->insertGetId([
                        'upt_id' => $umkm->managed_by_institution_id,
                        'name' => $umkm->name,
                        'slug' => Str::slug($umkm->name).'-'.$umkm->user_id,
                        'is_active' => $umkm->is_active ?? true,
                        'created_at' => $umkm->created_at ?? now(),
                        'updated_at' => $umkm->updated_at ?? now(),
                    ]);
                }

                DB::table('umkms')
                    ->where('id', $umkm->id)
                    ->update([
                        'umkm_organization_id' => $existingId,
                        'managed_by_institution_id' => $umkm->managed_by_institution_id,
                    ]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('umkms') && Schema::hasColumn('umkms', 'managed_by_institution_id') && ! Schema::hasColumn('umkms', 'managed_by_organization_id')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->renameColumn('managed_by_institution_id', 'managed_by_organization_id');
            });
        }

        if (Schema::hasTable('consultation_requests') && Schema::hasColumn('consultation_requests', 'institution_id') && ! Schema::hasColumn('consultation_requests', 'organization_id')) {
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->renameColumn('institution_id', 'organization_id');
            });
        }

        if (Schema::hasTable('institution_user') && Schema::hasColumn('institution_user', 'institution_id') && ! Schema::hasColumn('institution_user', 'organization_id')) {
            Schema::table('institution_user', function (Blueprint $table) {
                $table->renameColumn('institution_id', 'organization_id');
            });
        }

        if (Schema::hasTable('departments') && Schema::hasColumn('departments', 'institution_id') && ! Schema::hasColumn('departments', 'organization_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->renameColumn('institution_id', 'organization_id');
            });
        }

        if (Schema::hasTable('institution_user') && ! Schema::hasTable('organization_user')) {
            Schema::rename('institution_user', 'organization_user');
        }

        if (Schema::hasTable('institutions') && ! Schema::hasTable('organizations')) {
            Schema::rename('institutions', 'organizations');
        }
    }
};
