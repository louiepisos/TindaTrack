<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UtangController;

// ── PUBLIC ROUTES (walang authentication required) ──

// Root route - mag redirect sa login
Route::get('/', fn() => redirect()->route('login'));

// Login form display
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
// Login form submission
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
// Logout - mag-clear ng session (requires authentication)
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── PROTECTED ROUTES (requires authentication) ──
Route::middleware('auth')->group(function () {

    // Dashboard - homepage pagkahoman mag-login
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── PRODUCTS ROUTES ──
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');   // Add product
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');   // Edit product
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // Delete product

    // ── SUPPLIERS ROUTES ──
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');   // Add supplier
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy'); // Delete supplier

    // ── POS/SALES ROUTES ──
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');   // Record sale transaction

    // ── UTANG (CREDIT) ROUTES ──
    Route::get('/utang', [UtangController::class, 'index'])->name('utang.index');   // View all credit records
    Route::post('/utang/{utang}/pay', [UtangController::class, 'markPaid'])->name('utang.pay'); // Record payment
});
