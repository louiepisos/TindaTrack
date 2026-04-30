<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Sale;
use Carbon\Carbon;

// DashboardController - nag-display ng business metrics at overview
// Nag-compile ng important KPIs para sa business dashboard

class DashboardController extends Controller
{
    // Ipakita ang dashboard with all stats at recent products
    // Dito nag-calculate ng:
    // - Total products, low stock, categories, suppliers
    // - Revenue (total at today)
    // - Profit margin
    // - Recent products na may active inventory
    public function index()
    {
        // Count ang total active products
        $totalProducts = Product::count();
        // Count products na mababa ang stock (less than o equal to 10 units)
        $lowStock      = Product::where('stock_quantity', '<=', 10)->count();
        // Total number ng categories
        $categories    = Category::count();
        // Total number ng suppliers
        $suppliers     = Supplier::count();

        // Kunin ang total revenue from all sales
        $totalRevenue = Sale::sum('total_amount');
        // Calculate ang revenue for today only
        $todayRevenue = Sale::whereDate('created_at', Carbon::today())->sum('total_amount');

        // Initialize cost variables - gagamitin para mag-compute ng profit
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

        // Kunin ang recent products na active at may stock
        // Nag-sort by updated_at para makita ang recently modified items
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
