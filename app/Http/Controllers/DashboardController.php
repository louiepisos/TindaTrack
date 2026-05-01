<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Sale;
use Carbon\Carbon;

// DashboardController - ga display sa business metrics at overview
// ga compile sa mga importante nga KPIs (Key Performance Indicator) para sa business dashboard

class DashboardController extends Controller
{
    // ga pakita sa dashboard with all stats og recent products
    // Diri ga calculate ang:
    // - Total products, low stock, categories, suppliers
    // - Revenue (total at today)
    // - Profit margin
    // - Recent products na may active inventory
    public function index()
    {
        // ga count sa total active products
        $totalProducts = Product::count();
        // ga count sa gamay na ang stock (less than o equal to 10 units)
        $lowStock      = Product::where('stock_quantity', '<=', 10)->count();
        // Total number sa categories
        $categories    = Category::count();
        // Total number sa suppliers
        $suppliers     = Supplier::count();

        // ga kuha sa total revenue from all sales
        $totalRevenue = Sale::sum('total_amount');
        // ga calculate sa revenue for today only
        $todayRevenue = Sale::whereDate('created_at', Carbon::today())->sum('total_amount');

        // Initialize cost variables - gagamiton para mag-compute sa profit
        $totalCost = 0;
        $todayCost = 0;

        // Loop through all sales para makuha ang total cost (cost price * quantity)
        $allSales = Sale::with('items.product')->get();
        foreach ($allSales as $sale) {
            foreach ($sale->items as $item) {
                $totalCost += ($item->product->cost_price ?? 0) * $item->quantity;
            }
        }

        // Loop through today's sales para sa cost calculation
        $todaySales = Sale::with('items.product')->whereDate('created_at', Carbon::today())->get();
        foreach ($todaySales as $sale) {
            foreach ($sale->items as $item) {
                $todayCost += ($item->product->cost_price ?? 0) * $item->quantity;
            }
        }

        // Calculate profit = revenue - cost
        $totalProfit = $totalRevenue - $totalCost;
        $todayProfit = $todayRevenue - $todayCost;
        // Calculate profit margin percentage
        $profitMargin = $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 1) : 0;

        // Ga kuha sa recent products na active og naay stock
        // Ga sort by updated_at para makita ang recently modified items
        $recentProducts = Product::with('category')
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->orderBy('updated_at', 'desc')
            ->get()
            // Map/transform ang data para sa frontend display
            ->map(fn($p) => [
                'id'              => $p->id,
                'name'            => $p->name,
                'emoji'           => $p->emoji,
                'unit_price'      => $p->unit_price,
                'cost_price'      => $p->cost_price,
                'tingi_price'     => $p->tingi_price,
                'pieces_per_pack' => $p->pieces_per_pack,
                'stock_quantity'  => $p->stock_quantity,
                'restock_threshold' => $p->restock_threshold,
                'category'        => $p->category,
            ]);

        // Render ang dashboard page with all data
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'lowStock'      => $lowStock,
                'categories'    => $categories,
                'suppliers'     => $suppliers,
                'totalRevenue'  => round($totalRevenue, 2),
                'todayRevenue'  => round($todayRevenue, 2),
                'totalProfit'   => round($totalProfit, 2),
                'todayProfit'   => round($todayProfit, 2),
                'profitMargin'  => $profitMargin,
            ],
            'recentProducts' => $recentProducts,
        ]);
    }
}
