<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('amount_given', 10, 2)->default(0);
            $table->decimal('change_amount', 10, 2)->default(0);
            // 'paid' | 'utang'
            $table->string('payment_type', 20)->default('paid');
            $table->foreignId('utang_id')->nullable()->constrained('utang')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};