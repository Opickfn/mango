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
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_result_id')->constrained()->onDelete('cascade');
            $table->foreignId('assessment_category_id')->constrained()->onDelete('cascade');
            $table->decimal('gap_score', 8, 2)->default(0);
            $table->string('priority', 10);
            $table->text('recommendation_text');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
