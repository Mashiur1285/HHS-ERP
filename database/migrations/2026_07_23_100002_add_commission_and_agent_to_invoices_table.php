<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('agent_id')->nullable()->after('doctor_id')->constrained('agents')->nullOnDelete();

            // Doctor commission (charged on the test amount of the bill)
            $table->decimal('doctor_discount', 5, 2)->default(0)->after('discount_amount');
            $table->decimal('doctor_commission_percentage', 5, 2)->default(0)->after('doctor_discount');
            $table->decimal('doctor_commission_amount', 10, 2)->default(0)->after('doctor_commission_percentage');

            // Agent commission (charged on the bill subtotal)
            $table->decimal('agent_commission_percentage', 5, 2)->default(0)->after('doctor_commission_amount');
            $table->decimal('agent_commission_amount', 10, 2)->default(0)->after('agent_commission_percentage');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agent_id');
            $table->dropColumn([
                'doctor_discount',
                'doctor_commission_percentage',
                'doctor_commission_amount',
                'agent_commission_percentage',
                'agent_commission_amount',
            ]);
        });
    }
};
