<?php

use App\Enums\BloodGroup;
use App\Enums\Gender;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('last_name', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('personal_number', 14);
            $table->string('emergency_number', 14)->nullable();
            $table->string('bmdc', 16)->nullable();
            $table->string('specialties')->nullable();
            $table->string('designation')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 10)->default(Gender::MALE->value)->comment(implode('|', Gender::values()));
            $table->string('blood_group', 5)->nullable()->comment(implode('|', BloodGroup::values()));
            $table->string('address')->nullable();
            $table->boolean('is_system_user')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
