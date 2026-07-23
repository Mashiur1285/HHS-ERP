<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_settings', function (Blueprint $table) {
            // Which amount commission is calculated on: 'before' or 'after' discount.
            $table->string('doctor_commission_on', 10)->default('before')->after('show_test_room_number_on_bill');
            $table->string('agent_commission_on', 10)->default('after')->after('doctor_commission_on');
        });
    }

    public function down(): void
    {
        Schema::table('invoice_settings', function (Blueprint $table) {
            $table->dropColumn(['doctor_commission_on', 'agent_commission_on']);
        });
    }
};
