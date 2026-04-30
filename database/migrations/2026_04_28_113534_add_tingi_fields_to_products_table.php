<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('tingi_price', 10, 2)->nullable()->after('unit_price');
            $table->integer('pieces_per_pack')->default(1)->after('tingi_price');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['tingi_price', 'pieces_per_pack']);
        });
    }
};