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
        Schema::create('draft_patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guardian_id')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('salutation', 10)->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('emergency_number', 20)->nullable();
            $table->string('gender', 10)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('age_years', 10)->nullable();
            $table->string('age_months', 10)->nullable();
            $table->string('age_days', 10)->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->string('nid_number', 20)->nullable();
            $table->string('relation', 50)->nullable();
            $table->string('patient_category', 20)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draft_patients');
    }
};
