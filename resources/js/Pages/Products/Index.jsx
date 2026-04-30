import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// ProductsPage - nag-display at nag-manage ng product catalog
// May features para sa:
// - List lahat ng products with search at filtering
// - Add, edit, delete products
// - Pricing calculator with markup suggestion
// - Tingi pricing (per piece) support

export default function Products() {
    // Get data from server
    const { products, categories, suppliers } = usePage().props

    // Component state
    const [showModal, setShowModal] = useState(false)        // Show/hide add/edit modal
    const [editing, setEditing] = useState(null)             // Product ID kung nag-edit
    const [search, setSearch] = useState('')                 // Search query
    const [markupPercent, setMarkupPercent] = useState(30)   // Default markup percentage
    const [form, setForm] = useState({
        name: '', emoji: '📦', category_id: '',
        supplier_id: '', cost_price: '', unit_price: '', tingi_price: '',
        pieces_per_pack: 1, stock_quantity: '',
        restock_threshold: 10, unit: 'pcs'
    })

    // Available emojis para sa product icons
    const emojis = ['📦','🧃','☕','🍫','🍜','🥛','🧴','🥫','🧂','🍬','🍪','🧻','🪥','🧼','🫙','🐟','🍵','🍟']

    // Filter products based sa search query
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    // Open add product modal
    const openAdd = () => {
        setEditing(null)
        setForm({ name:'', emoji:'📦', category_id:'', supplier_id:'', cost_price:'', unit_price:'', tingi_price:'', pieces_per_pack:1, stock_quantity:'', restock_threshold:10, unit:'pcs' })
        setShowModal(true)
    }

    // Open edit product modal - kunin ang data ng product
    const openEdit = (p) => {
        setEditing(p.id)
        setForm({
            name: p.name, emoji: p.emoji,
            category_id: p.category_id ?? '',
            supplier_id: p.supplier_id ?? '',
            cost_price: p.cost_price ?? '',
            unit_price: p.unit_price,
            tingi_price: p.tingi_price ?? '',
            pieces_per_pack: p.pieces_per_pack ?? 1,
            stock_quantity: p.stock,
            restock_threshold: p.threshold,
            unit: p.unit
        })
        setShowModal(true)
    }

    // Save product (add o edit)
    const save = () => {
        if (editing) {
            // Update existing product
            router.put(`/products/${editing}`, form, { onSuccess: () => setShowModal(false) })
        } else {
            // Create new product
            router.post('/products', form, { onSuccess: () => setShowModal(false) })
        }
    }

    // Delete product - may confirmation dialog
    const destroy = (id, name) => {
        if (confirm(`Delete "${name}"?`)) {
            router.delete(`/products/${id}`)
        }
    }

    // Get status styling based sa stock level
    const statusStyle = (status) => {
        if (status === 'critical') return { bg: '#3d1a1a', color: '#d9534f', label: 'Critical' }
        if (status === 'low')      return { bg: '#3d2e0a', color: '#e8a236', label: 'Low Stock' }
        return { bg: '#1a3d2a', color: '#5aad7f', label: 'In Stock' }
    }

    // Suggest price based sa cost at markup percentage
    const suggestPrice = () => {
        if (!form.cost_price || parseFloat(form.cost_price) <= 0) {
            return alert('Enter cost price first')
        }
        const baseCost = parseFloat(form.cost_price)
        const markup = 1 + (parseFloat(markupPercent || 30) / 100)

        setForm({
            ...form,
            unit_price: (baseCost * markup).toFixed(2),
            tingi_price: form.pieces_per_pack ? (baseCost / parseInt(form.pieces_per_pack || 1) * markup).toFixed(2) : ''
        })
    }

    // Style object para sa consistency
    const inp = {
        width: '100%', padding: '10px 14px', borderRadius: 8,
        background: '#221e19', border: '1px solid #2e2820',
        color: '#f0e8d8', fontSize: 13, outline: 'none', boxSizing: 'border-box'
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f0d0a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── TOP NAVIGATION ── */}
            <div style={{
                background: '#1a1612', borderBottom: '1px solid #2e2820',
                padding: '0 32px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🏪</span>
                    <span style={{
                        fontSize: 20, fontWeight: 800,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TindaTrack</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => router.get('/dashboard')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📊 Dashboard</button>
                    <button onClick={() => router.post('/logout')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: 32 }}>
                {/* ── PAGE HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>📦 Products</h1>
                        <p style={{ color: '#7a6e60', margin: 0, fontSize: 14 }}>{products.length} products in catalog</p>
                    </div>
                    <button onClick={openAdd} style={{
                        padding: '10px 20px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                    }}>＋ Add Product</button>
                </div>

                {/* ── SEARCH BAR ── */}
                <div style={{ marginBottom: 20 }}>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍  Search by name or SKU..."
                        style={{ ...inp, maxWidth: 360, padding: '10px 16px' }}
                    />
                </div>

                {/* ── PRODUCTS TABLE ── */}
                <div style={{ background: '#1a1612', border: '1px solid #2e2820', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                                {['Product', 'Category', 'Cost', 'Price', 'Tingi', 'Stock', 'Unit', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        color: '#7a6e60', fontSize: 11, textAlign: 'left', fontWeight: 500,
                                        padding: '12px 20px', borderBottom: '1px solid #2e2820',
                                        textTransform: 'uppercase', letterSpacing: '.06em'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => {
                                const s = statusStyle(p.status)
                                return (
                                    <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(46,40,32,.5)' : 'none' }}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 9, background: '#221e19',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                                                }}>{p.emoji}</div>
                                                <div style={{ color: '#f0e8d8', fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{p.category ?? '—'}</td>
                                        <td style={{ padding: '14px 20px', color: '#4a90c4', fontWeight: 600, fontSize: 13 }}>₱{parseFloat(p.cost_price || 0).toFixed(2)}</td>
                                        <td style={{ padding: '14px 20px', color: '#e8a236', fontWeight: 600, fontSize: 13 }}>₱{parseFloat(p.unit_price).toFixed(2)}</td>
                                        <td style={{ padding: '14px 20px', color: '#5aad7f', fontWeight: 600, fontSize: 13 }}>{p.tingi_price ? `₱${parseFloat(p.tingi_price).toFixed(2)}` : '—'}</td>
                                        <td style={{ padding: '14px 20px', color: '#f0e8d8', fontSize: 13 }}>{p.stock}</td>
                                        <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 12 }}>{p.unit}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                                background: s.bg, color: s.color
                                            }}>{s.label}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => openEdit(p)} style={{
                                                    width: 30, height: 30, borderRadius: 7, border: '1px solid #2e2820',
                                                    background: '#221e19', cursor: 'pointer', fontSize: 13
                                                }}>✏️</button>
                                                <button onClick={() => destroy(p.id, p.name)} style={{
                                                    width: 30, height: 30, borderRadius: 7, border: '1px solid #2e2820',
                                                    background: '#221e19', cursor: 'pointer', fontSize: 13
                                                }}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: 48, textAlign: 'center', color: '#7a6e60' }}>
                            No products found.
                        </div>
                    )}
                </div>
            </div>

            {/* ── ADD/EDIT PRODUCT MODAL ── */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 520, maxHeight: '90vh',
                        overflow: 'auto', padding: 32
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 700, margin: 0 }}>
                                {editing ? '✏️ Edit Product' : '＋ Add Product'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{
                                background: '#221e19', border: '1px solid #2e2820',
                                borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#7a6e60', fontSize: 16
                            }}>✕</button>
                        </div>

                        {/* Emoji Picker */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 }}>Icon</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {emojis.map(e => (
                                    <button key={e} onClick={() => setForm({...form, emoji: e})} style={{
                                        width: 36, height: 36, borderRadius: 8, fontSize: 18, cursor: 'pointer',
                                        border: form.emoji === e ? '2px solid #e8a236' : '1px solid #2e2820',
                                        background: form.emoji === e ? 'rgba(232,162,54,.1)' : '#221e19'
                                    }}>{e}</button>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        {[
                            { label: 'Product Name *', key: 'name', placeholder: 'e.g. Candy Pack' },
                            { label: 'Cost Price (₱) *', key: 'cost_price', placeholder: '0.00', type: 'number' },
                            { label: 'Unit Price (₱) *', key: 'unit_price', placeholder: '0.00', type: 'number', helper: 'Price per pack' },
                            { label: 'Tingi Price (₱)', key: 'tingi_price', placeholder: '0.00', type: 'number', helper: 'Price per piece (optional)' },
                            { label: 'Pieces Per Pack', key: 'pieces_per_pack', placeholder: '1', type: 'number', helper: 'How many pieces in one pack?' },
                            { label: 'Stock Quantity *', key: 'stock_quantity', placeholder: '0', type: 'number' },
                            { label: 'Restock Threshold', key: 'restock_threshold', placeholder: '10', type: 'number' },
                            { label: 'Unit', key: 'unit', placeholder: 'pcs, sachet, box...' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                <input
                                    type={f.type ?? 'text'}
                                    value={form[f.key]}
                                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                                    placeholder={f.placeholder}
                                    style={inp}
                                />
                                {f.helper && <p style={{ color: '#7a6e60', fontSize: 10, margin: '4px 0 0', fontStyle: 'italic' }}>{f.helper}</p>}
                            </div>
                        ))}

                        {/* Category Select */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Category</label>
                            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} style={inp}>
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                            </select>
                        </div>

                        {/* Supplier Select */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Supplier</label>
                            <select value={form.supplier_id} onChange={e => setForm({...form, supplier_id: e.target.value})} style={inp}>
                                <option value="">Select supplier...</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        {/* Price Suggestion Tool */}
                        {form.cost_price && (
                            <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: 'rgba(232,162,54,.05)', border: '1px solid rgba(232,162,54,.2)' }}>
                                <label style={{ color: '#e8a236', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8, fontWeight: 600 }}>💡 Price Suggestion Tool</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 10 }}>
                                    <div>
                                        <label style={{ color: '#7a6e60', fontSize: 10, display: 'block', marginBottom: 4 }}>Markup %</label>
                                        <input type="number" min="0" max="200" value={markupPercent} onChange={e => setMarkupPercent(e.target.value)} style={{...inp, fontSize: 12}} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <button onClick={suggestPrice} style={{
                                            padding: '9px 16px', borderRadius: 8, border: 'none',
                                            background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                                            color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer'
                                        }}>Apply</button>
                                    </div>
                                </div>
                                <div style={{ padding: '10px 12px', borderRadius: 8, background: '#1a1612', color: '#5aad7f', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                                    Suggested Unit Price: ₱{(parseFloat(form.cost_price || 0) * (1 + parseFloat(markupPercent || 30) / 100)).toFixed(2)} per pack
                                </div>
                                {form.pieces_per_pack && (
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: '#1a1612', color: '#5aad7f', fontSize: 12, fontWeight: 600 }}>
                                        Suggested Tingi Price: ₱{(parseFloat(form.cost_price || 0) / (parseInt(form.pieces_per_pack || 1)) * (1 + parseFloat(markupPercent || 30) / 100)).toFixed(2)} per piece
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Modal Actions */}
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                padding: '10px 20px', borderRadius: 8, border: '1px solid #2e2820',
                                background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                            }}>Cancel</button>
                            <button onClick={save} style={{
                                padding: '10px 24px', borderRadius: 8, border: 'none',
                                background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                            }}>💾 Save Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
