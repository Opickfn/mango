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
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('type');
            $table->string('brand')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->morphs('owner');
            $table->enum('status', ['available', 'reserved', 'maintenance', 'in_use'])->default('available');
            $table->decimal('hourly_rate', 15, 2)->default(0);
            $table->boolean('is_iot_enabled')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
