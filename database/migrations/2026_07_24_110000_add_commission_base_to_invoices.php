<?php

use App\Models\Test;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // The exact amount each commission was calculated on, captured at
            // creation time so reports always reconcile (base × pct === commission).
            $table->decimal('doctor_commission_base', 10, 2)->default(0)->after('doctor_commission_amount');
            $table->decimal('agent_commission_base', 10, 2)->default(0)->after('agent_commission_amount');
        });

        // Backfill existing invoices (created under before-discount logic):
        // agent base = subtotal, doctor base = sum of test line totals.
        DB::table('invoices')->update(['agent_commission_base' => DB::raw('subtotal')]);

        DB::statement('
            UPDATE invoices SET doctor_commission_base = COALESCE((
                SELECT SUM(invoice_items.total)
                FROM invoice_items
                WHERE invoice_items.invoice_id = invoices.id
                  AND invoice_items.itemable_type = ?
            ), 0)
        ', [Test::class]);
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['doctor_commission_base', 'agent_commission_base']);
        });
    }
};
