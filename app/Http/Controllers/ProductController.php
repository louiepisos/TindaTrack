<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

// ProductController - Ga manage sa inventory products
// Ga handle sa CRUD operations para sa products
// Naay special pricing features parehas sa tingi pricing og pack pricing

class ProductController extends Controller
{
    // Ga pakita sa tanan active products sa table para sa frontend
    public function index()
    {
        // Mag get sa tanan products na active with relationships sa category og supplier
        $products = Product::with(['category', 'supplier'])
            ->where('is_active', true)
            ->latest()  // Sort by most recent first
            ->get()
            // I-transform ang bawat product para sa display sa frontend
            ->map(fn($p) => [
                'id'              => $p->id,
                'name'            => $p->name,
                'sku'             => $p->sku,
                'emoji'           => $p->emoji,
                'category'        => optional($p->category)->name,
                'category_id'     => $p->category_id,
                'supplier'        => optional($p->supplier)->name,
                'supplier_id'     => $p->supplier_id,
                'cost_price'      => $p->cost_price,   // Buying price from supplier
                'unit_price'      => $p->unit_price,   // Selling price per pack
                'tingi_price'     => $p->tingi_price,  // Price per individual piece
                'pieces_per_pack' => $p->pieces_per_pack,
                'stock'           => $p->stock_quantity,
                'threshold'       => $p->restock_threshold,
                'unit'            => $p->unit,
                'status'          => $p->status,
            ]);

        // Render ang products page with data
        return Inertia::render('Products/Index', [
            'products'   => $products,
            'categories' => Category::where('is_active', true)->get(['id', 'name', 'emoji']),
            'suppliers'  => Supplier::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    // Mag-add og bag ong product sa database
    public function store(Request $request)
    {
        // Validate tanan nga required fields bag o ma-save
        // Cost price kay kinailangan para ma compute ang profit margin
        // Tingi price kay optional para sa items na pwede i baligya by piece
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'sku'               => 'nullable|string|unique:products,sku',
            'emoji'             => 'nullable|string|max:10',
            'category_id'       => 'nullable|exists:categories,id',
            'supplier_id'       => 'nullable|exists:suppliers,id',
            'cost_price'        => 'required|numeric|min:0',  // Amount paid to supplier
            'unit_price'        => 'required|numeric|min:0',  // Selling price per unit/pack
            'tingi_price'       => 'nullable|numeric|min:0',  // Optional: price per piece
            'pieces_per_pack'   => 'nullable|integer|min:1',  // How many pieces in a pack
            'stock_quantity'    => 'required|integer|min:0',
            'restock_threshold' => 'nullable|integer|min:0',  // Alert when stock drops below this
            'unit'              => 'nullable|string|max:30',  // pcs, sachet, box, etc.
        ]);

        // Set default emoji kung walay provided
       $data['sku'] = !empty($data['sku']) ? $data['sku'] : 'PRD-' . strtoupper(Str::random(6));
       $data['emoji'] = $data['emoji'] ?? '📦';
       $data['is_active'] = true; 
        // New productsk kay automatically active
        

        // Save sa database
        Product::create($data);
        return back()->with('success', 'Product added successfully.');
    }

    // Update existing product
    public function update(Request $request, Product $product)
    {
        // Validate ang incoming data - similar sa store but allow updating same SKU
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'sku'               => 'nullable|string|unique:products,sku,' . $product->id,
            'emoji'             => 'nullable|string|max:10',
            'category_id'       => 'nullable|exists:categories,id',
            'supplier_id'       => 'nullable|exists:suppliers,id',
            'cost_price'        => 'required|numeric|min:0',
            'unit_price'        => 'required|numeric|min:0',
            'tingi_price'       => 'nullable|numeric|min:0',
            'pieces_per_pack'   => 'nullable|integer|min:1',
            'stock_quantity'    => 'required|integer|min:0',
            'restock_threshold' => 'nullable|integer|min:0',
            'unit'              => 'nullable|string|max:30',
        ]);

        // Update ang product with new data
        $product->update($data);
        return back()->with('success', 'Product updated.');
    }

    // Delete (soft delete) ang product
    // Ang product kay dili jud deleted mark lang as deleted
    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product removed.');
    }
}
