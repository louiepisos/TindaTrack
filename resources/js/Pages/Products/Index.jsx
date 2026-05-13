// Importing necessary libraries for React and Inertia.js routing - gamit sa produkto management
import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// Main component for Products page - ang sulod sa produkto list ug management
export default function Products() {
    // Getting data from server props - daghan produkto, categories, suppliers
    const { products, categories, suppliers } = usePage().props
    // State variables for modal, editing, search, form - para sa user interactions
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({
        name: '', emoji: '📦',
        category_id: '', supplier_id: '',
        cost_price: '', unit_price: '',
        tingi_price: '', pieces_per_pack: 1,
        stock_quantity: '', restock_threshold: 10,
        unit: 'pcs', selling_mode: 'tingi'
    })

    // List of available emojis for products - daghan choices para sa produkto icons
    const emojis = ['📦','🧃','☕','🍫','🍜','🥛','🧴','🥫','🧂','🍬','🍪','🧻','🪥','🧼','🫙','🐟','🍵','🍟']

    // Filtering products based on search - para makita ang gusto nga produkto
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    // Function to open add modal - para mag-add ug bag-ong produkto
    const openAdd = () => {
        setEditing(null)
        setForm({
            name: '', emoji: '📦', category_id: '', supplier_id: '',
            cost_price: '', unit_price: '', tingi_price: '',
            pieces_per_pack: 1, stock_quantity: '',
            restock_threshold: 10, unit: 'pcs', selling_mode: 'tingi'
        })
        setShowModal(true)
    }

    // Function to open edit modal - para mag-edit sa existing produkto
    const openEdit = (p) => {
        setEditing(p.id)
        const mode = p.unit_price && p.tingi_price ? 'both'
            : p.tingi_price ? 'tingi' : 'pack'
        setForm({
            name: p.name, emoji: p.emoji,
            category_id: p.category_id ?? '',
            supplier_id: p.supplier_id ?? '',
            cost_price: p.cost_price ?? '',
            unit_price: p.unit_price ?? '',
            tingi_price: p.tingi_price ?? '',
            pieces_per_pack: p.pieces_per_pack ?? 1,
            stock_quantity: p.stock,
            restock_threshold: p.threshold,
            unit: p.unit,
            selling_mode: mode
        })
        setShowModal(true)
    }

    // Function to save product - para i-save ang produkto sa database
    const save = () => {
        // Clear prices based on selling mode
        const data = { ...form }
        if (data.selling_mode === 'tingi') {
            data.unit_price = data.tingi_price // unit price = tingi price
            data.pieces_per_pack = 1
        } else if (data.selling_mode === 'pack') {
            data.tingi_price = null
            data.pieces_per_pack = 1
        }
        // 'both' keeps all values as is

        if (editing) {
            router.put(`/products/${editing}`, data, {
                onSuccess: () => setShowModal(false)
            })
        } else {
            router.post('/products', data, {
                onSuccess: () => setShowModal(false)
            })
        }
    }

    // Function to delete product - para tangtangon ang produkto
    const destroy = (id, name) => {
        if (confirm(`Delete "${name}"?`)) router.delete(`/products/${id}`)
    }

    // Function to get status style - para sa stock status display
    const statusStyle = (status) => {
        if (status === 'critical') return { bg: '#3d1a1a', color: '#d9534f', label: 'Critical' }
        if (status === 'low') return { bg: '#3d2e0a', color: '#e8a236', label: 'Low Stock' }
        return { bg: '#1a3d2a', color: '#5aad7f', label: 'In Stock' }
    }

    // Input style object - gamit sa form inputs
    const inp = {
        width: '100%', padding: '10px 14px', borderRadius: 8,
        background: '#221e19', border: '1px solid #2e2820',
        color: '#f0e8d8', fontSize: 13, outline: 'none', boxSizing: 'border-box'
    }

    // Label component function - para sa form labels
    const label = (text, hint = '') => (
        <div style={{ marginBottom: 6 }}>
            <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                {text}
            </label>
            {hint && <span style={{ color: '#4a4238', fontSize: 11, marginLeft: 8 }}>{hint}</span>}
        </div>
    )

    // Selling mode options - daghan options para sa baligya mode
    const sellingModes = [
        { value: 'tingi', label: '🍬 By Piece (Tingi)', desc: 'Sell per piece only (e.g. candy, matches)' },
        { value: 'pack',  label: '📦 By Pack only',    desc: 'Sell as whole pack only (e.g. noodles, soap)' },
        { value: 'both',  label: '🔀 Both',            desc: 'Can sell by piece or by pack (e.g. Milo sachet)' },
    ]

    // Main JSX return - ang display sa produkto page
    return (
        // Main container - ang sulod sa tibuok page
        <div style={{ minHeight: '100vh', background: '#0f0d0a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Topbar - ang navigation bar sa taas */}
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
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.get('/dashboard')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📊 Dashboard</button>
                    <button onClick={() => router.get('/utang')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📋 Utang</button>
                    <button onClick={() => router.get('/sales')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>🧾 Sales</button>
                    <button onClick={() => router.post('/logout')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>Logout</button>
                </div>
            </div>

            {/* Main content area - ang sulod sa produkto list */}
            <div style={{ padding: 32 }}>
                {/* Header - ang title ug add button */}
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

                {/* Search - para mag-search sa produkto */}
                <div style={{ marginBottom: 20 }}>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍  Search products..."
                        style={{ ...inp, maxWidth: 360, padding: '10px 16px' }}
                    />
                </div>

                {/* Table - ang list sa produkto */}
                <div style={{ background: '#1a1612', border: '1px solid #2e2820', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                                {['Product', 'Category', 'Selling Mode', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        color: '#7a6e60', fontSize: 11, textAlign: 'left',
                                        padding: '12px 20px', borderBottom: '1px solid #2e2820',
                                        textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 500
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => {
                                const s = statusStyle(p.status)
                                const hasTingi = p.tingi_price && parseFloat(p.tingi_price) > 0
                                const hasPack = p.unit_price && parseFloat(p.unit_price) > 0
                                const mode = hasTingi && hasPack ? 'both' : hasTingi ? 'tingi' : 'pack'
                                return (
                                    <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(46,40,32,.5)' : 'none' }}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 9, background: '#221e19',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                                                }}>{p.emoji}</div>
                                                <div>
                                                    <div style={{ color: '#f0e8d8', fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                                                    <div style={{ color: '#7a6e60', fontSize: 11 }}>{p.unit}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{p.category ?? '—'}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                                background: mode === 'both' ? 'rgba(74,144,196,.12)' : mode === 'tingi' ? 'rgba(90,173,127,.12)' : 'rgba(232,162,54,.12)',
                                                color: mode === 'both' ? '#4a90c4' : mode === 'tingi' ? '#5aad7f' : '#e8a236',
                                            }}>
                                                {mode === 'both' ? '🔀 Both' : mode === 'tingi' ? '🍬 Tingi' : '📦 Pack'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            {hasPack && <div style={{ color: '#e8a236', fontSize: 13, fontWeight: 600 }}>₱{parseFloat(p.unit_price).toFixed(2)} <span style={{ color: '#4a4238', fontWeight: 400 }}>/ pack</span></div>}
                                            {hasTingi && <div style={{ color: '#5aad7f', fontSize: 13, fontWeight: 600 }}>₱{parseFloat(p.tingi_price).toFixed(2)} <span style={{ color: '#4a4238', fontWeight: 400 }}>/ pc</span></div>}
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#f0e8d8', fontSize: 13 }}>{p.stock} {p.unit}</td>
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
                        <div style={{ padding: 48, textAlign: 'center', color: '#7a6e60' }}>No products found.</div>
                    )}
                </div>
            </div>

            {/* Modal - ang popup para add/edit produkto */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 540, maxHeight: '90vh',
                        overflow: 'auto', padding: 32,
                        boxShadow: '0 40px 80px rgba(0,0,0,.6)'
                    }}>
                        {/* Modal Header - ang title sa modal */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 700, margin: 0 }}>
                                {editing ? '✏️ Edit Product' : '＋ Add Product'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{
                                background: '#221e19', border: '1px solid #2e2820',
                                borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#7a6e60'
                            }}>✕</button>
                        </div>

                        {/* Emoji selection - para pilion ang icon sa produkto */}
                        <div style={{ marginBottom: 16 }}>
                            {label('Icon')}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {emojis.map(e => (
                                    <button key={e} onClick={() => setForm({...form, emoji: e})} style={{
                                        width: 36, height: 36, borderRadius: 8, fontSize: 18, cursor: 'pointer',
                                        border: form.emoji === e ? '2px solid #e8a236' : '1px solid #2e2820',
                                        background: form.emoji === e ? 'rgba(232,162,54,.1)' : '#221e19'
                                    }}>{e}</button>
                                ))}
                            </div>
                        </div>

                        {/* Product Name input - ang name sa produkto */}
                        <div style={{ marginBottom: 14 }}>
                            {label('Product Name *')}
                            <input type="text" value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                                placeholder="e.g. Maxx Candy" style={inp} />
                        </div>

                        {/* Selling Mode selection - unsaon pag-baligya ang produkto */}
                        <div style={{ marginBottom: 20 }}>
                            {label('Selling Mode *', 'How do you sell this product?')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {sellingModes.map(m => (
                                    <button key={m.value} onClick={() => setForm({...form, selling_mode: m.value})} style={{
                                        padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                                        textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2,
                                        border: form.selling_mode === m.value ? '2px solid #e8a236' : '1px solid #2e2820',
                                        background: form.selling_mode === m.value ? 'rgba(232,162,54,.08)' : '#221e19',
                                    }}>
                                        <span style={{ color: '#f0e8d8', fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                                        <span style={{ color: '#7a6e60', fontSize: 11 }}>{m.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cost Price input - ang presyo nga gibayran sa produkto */}
                        <div style={{ marginBottom: 14 }}>
                            {label('Cost Price (₱) *', 'How much you paid for this batch')}
                            <input type="number" min="0" step="0.01"
                                value={form.cost_price}
                                onChange={e => setForm({...form, cost_price: e.target.value})}
                                placeholder="0.00" style={inp} />
                        </div>

                        {/* Pack Price input - presyo sa pack */}
                        {(form.selling_mode === 'pack' || form.selling_mode === 'both') && (
                            <div style={{ marginBottom: 14 }}>
                                {label('Pack Price (₱) *', 'Selling price for whole pack')}
                                <input type="number" min="0" step="0.01"
                                    value={form.unit_price}
                                    onChange={e => setForm({...form, unit_price: e.target.value})}
                                    placeholder="0.00" style={inp} />
                            </div>
                        )}

                        {/* Tingi Price input - presyo sa tingi */}
                        {(form.selling_mode === 'tingi' || form.selling_mode === 'both') && (
                            <div style={{ marginBottom: 14 }}>
                                {label('Tingi Price (₱) *', 'Selling price per piece')}
                                <input type="number" min="0" step="0.01"
                                    value={form.tingi_price}
                                    onChange={e => setForm({...form, tingi_price: e.target.value})}
                                    placeholder="0.00" style={inp} />
                            </div>
                        )}

                        {/* Pieces per pack input - pila ka pieces sa pack */}
                        {form.selling_mode === 'both' && (
                            <div style={{ marginBottom: 14 }}>
                                {label('Pieces per Pack', 'How many pieces in one pack')}
                                <input type="number" min="1"
                                    value={form.pieces_per_pack}
                                    onChange={e => setForm({...form, pieces_per_pack: e.target.value})}
                                    placeholder="1" style={inp} />
                            </div>
                        )}

                        {/* Stock and Threshold inputs - ang stock quantity ug threshold */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                            <div>
                                {label('Stock Quantity *')}
                                <input type="number" min="0"
                                    value={form.stock_quantity}
                                    onChange={e => setForm({...form, stock_quantity: e.target.value})}
                                    placeholder="0" style={inp} />
                            </div>
                            <div>
                                {label('Restock Threshold')}
                                <input type="number" min="0"
                                    value={form.restock_threshold}
                                    onChange={e => setForm({...form, restock_threshold: e.target.value})}
                                    placeholder="10" style={inp} />
                            </div>
                        </div>

                        {/* Unit input - ang unit sa produkto */}
                        <div style={{ marginBottom: 14 }}>
                            {label('Unit')}
                            <input type="text"
                                value={form.unit}
                                onChange={e => setForm({...form, unit: e.target.value})}
                                placeholder="pcs, sachet, box..." style={inp} />
                        </div>

                        {/* Category select - ang category sa produkto */}
                        <div style={{ marginBottom: 14 }}>
                            {label('Category')}
                            <select value={form.category_id}
                                onChange={e => setForm({...form, category_id: e.target.value})}
                                style={inp}>
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                            </select>
                        </div>

                        {/* Supplier select - ang supplier sa produkto */}
                        <div style={{ marginBottom: 24 }}>
                            {label('Supplier')}
                            <select value={form.supplier_id}
                                onChange={e => setForm({...form, supplier_id: e.target.value})}
                                style={inp}>
                                <option value="">Select supplier...</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        {/* ── PRICE SUGGESTION TOOL ── */}
        {form.cost_price > 0 && (
            <div style={{
                marginBottom: 24, padding: 16, borderRadius: 12,
                background: 'rgba(232,162,54,.06)', border: '1px solid rgba(232,162,54,.2)'
            }}>
                <div style={{ color: '#e8a236', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                    💡 Price Suggestion Tool
                </div>

                {/* Markup slider */}
                <div style={{ marginBottom: 12 }}>
                    <label style={{ color: '#7a6e60', fontSize: 11, display: 'block', marginBottom: 6 }}>
                        Markup % — {form.markup ?? 30}%
                    </label>
                    <input
                        type="range" min="5" max="200" step="5"
                        value={form.markup ?? 30}
                        onChange={e => setForm({...form, markup: parseInt(e.target.value)})}
                        style={{ width: '100%', accentColor: '#e8a236' }}
                    />
                </div>

                {/* Suggestions based on selling mode */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Pack suggestion — show if pack or both */}
                    {(form.selling_mode === 'pack' || form.selling_mode === 'both') && (
                        <div style={{
                            padding: '10px 14px', borderRadius: 8,
                            background: 'rgba(232,162,54,.08)', border: '1px solid rgba(232,162,54,.15)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ color: '#7a6e60', fontSize: 12 }}>
                                Suggested Pack Price:
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#e8a236', fontSize: 14, fontWeight: 700 }}>
                                    ₱{(parseFloat(form.cost_price || 0) * (1 + (form.markup ?? 30) / 100)).toFixed(2)}
                                </span>
                                <button onClick={() => setForm({
                                    ...form,
                                    unit_price: (parseFloat(form.cost_price || 0) * (1 + (form.markup ?? 30) / 100)).toFixed(2)
                                })} style={{
                                    padding: '4px 10px', borderRadius: 6, border: 'none',
                                    background: '#e8a236', color: '#fff',
                                    fontSize: 11, fontWeight: 600, cursor: 'pointer'
                                }}>Apply</button>
                            </div>
                        </div>
                    )}

                    {/* Tingi suggestion — show if tingi or both */}
                    {(form.selling_mode === 'tingi' || form.selling_mode === 'both') && form.stock_quantity > 0 && (
                        <div style={{
                            padding: '10px 14px', borderRadius: 8,
                            background: 'rgba(90,173,127,.08)', border: '1px solid rgba(90,173,127,.15)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ color: '#7a6e60', fontSize: 12 }}>
                                Suggested Tingi Price: <span style={{ color: '#4a4238' }}>
                                    (cost ÷ {form.stock_quantity} pcs × markup)
                                </span>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#5aad7f', fontSize: 14, fontWeight: 700 }}>
                                    ₱{(parseFloat(form.cost_price || 0) / parseFloat(form.stock_quantity || 1) * (1 + (form.markup ?? 30) / 100)).toFixed(2)}
                                </span>
                                <button onClick={() => setForm({
                                    ...form,
                                    tingi_price: (parseFloat(form.cost_price || 0) / parseFloat(form.stock_quantity || 1) * (1 + (form.markup ?? 30) / 100)).toFixed(2)
                                })} style={{
                                    padding: '4px 10px', borderRadius: 6, border: 'none',
                                    background: '#5aad7f', color: '#fff',
                                    fontSize: 11, fontWeight: 600, cursor: 'pointer'
                                }}>Apply</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

                        {/* Modal Actions - ang buttons sa modal */}
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