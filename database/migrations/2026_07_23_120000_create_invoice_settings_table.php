<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_settings', function (Blueprint $table) {
            $table->id();

            // Letterhead / header
            $table->string('business_name')->nullable();
            $table->string('address', 500)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('business_logo')->nullable();
            $table->boolean('show_header')->default(true);
            $table->text('header_text')->nullable();
            $table->string('header_text_alignment', 10)->default('center'); // left|center|right

            // Footer
            $table->boolean('show_footer')->default(false);
            $table->text('footer_text')->nullable();
            $table->string('footer_text_alignment', 10)->default('center');

            // Watermark
            $table->boolean('show_watermark')->default(true);
            $table->string('watermark_type', 20)->default('payment_status'); // payment_status|logo
            $table->string('watermark_logo')->nullable();
            $table->string('watermark_orientation', 12)->default('diagonal'); // horizontal|diagonal|obtuse

            // QR + margins
            $table->boolean('show_qr')->default(false);
            $table->decimal('invoice_print_top_margin', 4, 2)->default(0);

            // Dynamic field / column configuration
            $table->json('header_fields')->nullable();
            $table->string('fields_columns', 1)->default('2'); // 1 or 2
            $table->json('footer_fields')->nullable();
            $table->json('table_columns')->nullable();
            $table->boolean('show_test_room_number_on_bill')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_settings');
    }
};
