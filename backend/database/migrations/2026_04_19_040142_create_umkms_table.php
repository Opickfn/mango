<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
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

        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('managed_by_institution_id')->nullable()->constrained('institutions')->nullOnDelete();
            $table->foreignId('umkm_organization_id')->constrained('umkm_organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('owner_name');
            $table->string('nib')->nullable();
            $table->string('sector');
            $table->year('established_year')->nullable();
            $table->integer('employee_count')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
        Schema::dropIfExists('umkm_organizations');
    }
};
