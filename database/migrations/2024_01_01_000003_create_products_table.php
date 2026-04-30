<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('emoji', 10)->default('📦');
            $table->text('description')->nullable();

            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            $table->foreignId('supplier_id')
                  ->nullable()
                  ->constrained('suppliers')
                  ->nullOnDelete();

            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('cost_price', 10, 2)->default(0);  // buying price from supplier
            $table->integer('stock_quantity')->default(0);
            $table->integer('restock_threshold')->default(10); // alert when stock <= this
            $table->integer('max_stock')->nullable();          // optional max capacity

            $table->string('unit', 30)->default('pcs');       // pcs, box, sachet, etc.
            $table->string('barcode')->nullable()->unique();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes(); // allow soft-delete (trash) instead of hard delete
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
