<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

// SupplierController - nag manage sa supplier information
// Nag handle ng CRUD para sa suppliers na nag provide sa products

class SupplierController extends Controller
{
    // Ipakita tanan nga active suppliers
    public function index()
    {
        // Kuhaon tanan nga active suppliers, sorted by most recent
        $suppliers = Supplier::where('is_active', true)
            ->latest()
            ->get();

        // Render ang suppliers page
        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    // Mag add og bag ong supplier
    public function store(Request $request)
    {
        // Validate ang supplier information
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'contact_person'  => 'nullable|string|max:255',  // Name ng contact person
            'email'           => 'nullable|email|max:255',   // Email address
            'phone'           => 'nullable|string|max:20',   // Phone number
            'address'         => 'nullable|string|max:500',  // Street address
            'city'            => 'nullable|string|max:100',  // City name
            'notes'           => 'nullable|string|max:1000', // Additional notes/info
        ]);

        // Set new suppliers as active by default
        $data['is_active'] = true;
        // Create ang supplier
        Supplier::create($data);

        return back()->with('success', 'Supplier added successfully.');
    }

    // Delete (deactivate) ang supplier
    // Instead na mag-delete, nag-mark lang as inactive
    public function destroy(Supplier $supplier)
    {
        $supplier->update(['is_active' => false]);
        return back()->with('success', 'Supplier removed.');
    }
}
