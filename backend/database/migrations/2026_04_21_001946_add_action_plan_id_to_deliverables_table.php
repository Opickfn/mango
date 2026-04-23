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
        Schema::table('deliverables', function (Blueprint $table) {
            $table->foreignId('action_plan_id')->nullable()->constrained('action_plans')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->foreignId('iteration_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deliverables', function (Blueprint $table) {
            $table->dropConstrainedForeignId('action_plan_id');
            $table->dropColumn('description');
            $table->foreignId('iteration_id')->nullable(false)->change();
        });
    }
};
