<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                  ->constrained('products')
                  ->cascadeOnDelete();

            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            // 'sale' | 'restock' | 'adjustment' | 'return' | 'damaged'
            $table->string('type', 30);

            $table->integer('quantity');            // positive = stock in, negative = stock out
            $table->integer('stock_before');        // snapshot of stock before this transaction
            $table->integer('stock_after');         // snapshot of stock after this transaction

            $table->decimal('unit_price', 10, 2)->nullable();   // price at time of transaction
            $table->decimal('total_amount', 12, 2)->nullable();  // quantity * unit_price

            $table->string('reference_number')->nullable();      // receipt/PO number
            $table->text('notes')->nullable();

            $table->timestamp('transacted_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
