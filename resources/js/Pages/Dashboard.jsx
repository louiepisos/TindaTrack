import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// DashboardPage - ang main dashboard pagkatapos mag-login
// Nag-display ng business metrics at POS (point of sale) system
// May features para sa:
// - Sales metrics (revenue, profit, low stock alerts)
// - POS interface para sa quick sales entry
// - Payment tracking (cash at utang/credit)

export default function Dashboard() {
    // Get data mula sa server - stats, products, current user
    const { stats, recentProducts, auth } = usePage().props

    // POS Modal State
    const [showPOS, setShowPOS] = useState(false)          // Show/hide POS modal
    const [items, setItems] = useState([])                 // Items in current sale
    const [amountGiven, setAmountGiven] = useState('')     // Cash amount given
    const [paymentType, setPaymentType] = useState('paid') // 'paid' o 'utang'
    const [customerName, setCustomerName] = useState('')   // Customer name (for utang)
    const [contactNumber, setContactNumber] = useState('') // Customer number (for utang)
    const [showChange, setShowChange] = useState(false)    // Show change modal
    const [changeAmount, setChangeAmount] = useState(0)    // Amount ng change
    const [processing, setProcessing] = useState(false)    // Nag-process ng sale

    // Calculate ang total amount ng sale
    const total = items.reduce((sum, i) => sum + i.total_price, 0)
    // Calculate ang change (kung may overpayment)
    const change = Math.max(0, parseFloat(amountGiven || 0) - total)

    // Add item sa POS
    const addItem = () => {
        setItems([...items, {
            product_id: '',
            product_name: '',
            emoji: '📦',
            quantity: 1,
            is_tingi: false,          // Whole pack by default
            unit_price: 0,
            tingi_price: 0,
            pieces_per_pack: 1,
            total_price: 0,
        }])
    }

    // Remove item mula sa POS
    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx))
    }

    // Update item sa POS - nag-handle ng product selection, qty changes, tingi toggle
    const updateItem = (idx, field, value) => {
        const updated = [...items]
        updated[idx][field] = value

        // Kung nag-change ang product selection, kunin ang product details
        if (field === 'product_id') {
            const prod = recentProducts.find(p => p.id == value)
            if (prod) {
                updated[idx].product_name   = prod.name
                updated[idx].emoji          = prod.emoji
                updated[idx].tingi_price    = parseFloat(prod.tingi_price || prod.unit_price)
                updated[idx].pieces_per_pack= prod.pieces_per_pack || 1
                // Set price based on tingi o whole pack
                updated[idx].unit_price     = updated[idx].is_tingi
                    ? parseFloat(prod.tingi_price || prod.unit_price)
                    : parseFloat(prod.unit_price)
                updated[idx].total_price    = updated[idx].unit_price * updated[idx].quantity
            }
        }

        // Kung nag-toggle ang tingi checkbox
        if (field === 'is_tingi') {
            const prod = recentProducts.find(p => p.id == updated[idx].product_id)
            if (value) {
                // Tingi mode - price per piece
                updated[idx].unit_price = parseFloat(prod?.tingi_price || prod?.unit_price || 0)
            } else {
                // Pack mode - full unit price
                updated[idx].unit_price = parseFloat(prod?.unit_price || 0)
            }
            updated[idx].total_price = updated[idx].unit_price * updated[idx].quantity
        }

        // Kung nag-change ang quantity
        if (field === 'quantity') {
            updated[idx].total_price = updated[idx].unit_price * parseInt(value || 0)
        }

        setItems(updated)
    }

    // Tingi calculator - kung magkano ang pieces na pwedeng bilhin sa amount given
    const tingiCalc = (item) => {
        if (!item.tingi_price || item.tingi_price <= 0) return 0
        return Math.floor(parseFloat(amountGiven || 0) / item.tingi_price)
    }

    // Reset ang POS modal to initial state
    const resetPOS = () => {
        setItems([])
        setAmountGiven('')
        setPaymentType('paid')
        setCustomerName('')
        setContactNumber('')
        setShowPOS(false)
        setShowChange(false)
    }

    // Submit ang sale to server
    const submitSale = () => {
        // Validate kung may items
        if (items.length === 0) return alert('Add at least one item!')
        // Validate kung may sapat na amount given (for cash payment)
        if (paymentType === 'paid' && (!amountGiven || parseFloat(amountGiven) < total)) {
            return alert('Amount given is less than total!')
        }

        setProcessing(true)
        // POST ang sale data sa server
        router.post('/sales', {
            items,
            total_amount:   total,
            payment_type:   paymentType,
            amount_given:   parseFloat(amountGiven || 0),
            customer_name:  customerName,
            contact_number: contactNumber,
        }, {
            onSuccess: () => {
                setProcessing(false)
                if (paymentType === 'paid') {
                    // Show ang change modal para sa cash payment
                    setChangeAmount(change)
                    setShowPOS(false)
                    setShowChange(true)
                } else {
                    // Para sa utang, reset lang
                    resetPOS()
                    alert('Utang recorded successfully!')
                }
            },
            onError: () => setProcessing(false),
        })
    }

    // Style objects para sa consistent styling
    const s = {
        card: {
            background: '#1a1612', border: '1px solid #2e2820',
            borderRadius: 16, padding: 24
        },
        inp: {
            padding: '9px 12px', borderRadius: 8,
            background: '#221e19', border: '1px solid #2e2820',
            color: '#f0e8d8', fontSize: 13, outline: 'none',
            width: '100%', boxSizing: 'border-box'
        },
        label: {
            color: '#7a6e60', fontSize: 11,
            textTransform: 'uppercase', letterSpacing: '.07em',
            display: 'block', marginBottom: 5
        },
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f0d0a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── TOP NAVIGATION BAR ── */}
            <div style={{
                background: '#1a1612', borderBottom: '1px solid #2e2820',
                padding: '0 32px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                {/* Brand/Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🏪</span>
                    <span style={{
                        fontSize: 20, fontWeight: 800,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TindaTrack</span>
                </div>
                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.get('/products')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📦 Products</button>
                    <button onClick={() => router.get('/utang')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📋 Utang</button>
                    <button onClick={() => router.post('/logout')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: 32 }}>
                {/* ── PAGE HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>Dashboard 📊</h1>
                        <p style={{ color: '#7a6e60', margin: 0 }}>Welcome back, {auth?.user?.name}!</p>
                    </div>
                    {/* New Sale Button - mag-open ng POS modal */}
                    <button onClick={() => setShowPOS(true)} style={{
                        padding: '12px 28px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(196,92,42,.4)'
                    }}>🛒 New Sale</button>
                </div>

                {/* ── KPI CARDS - INVENTORY STATS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                        { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#e8a236' },
                        { label: 'Low Stock',      value: stats.lowStock,      icon: '⚠️', color: '#d9534f' },
                        { label: 'Categories',     value: stats.categories,    icon: '🗂️', color: '#5aad7f' },
                        { label: 'Suppliers',      value: stats.suppliers,     icon: '🚚', color: '#4a90c4' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 16, padding: 24
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ color: '#7a6e60', fontSize: 13, marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── KPI CARDS - REVENUE STATS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                        {
                            label: 'Total Revenue',
                            value: `₱${stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                            subtext: `Profit: ₱${stats.totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                            icon: '💰',
                            color: '#5aad7f'
                        },
                        {
                            label: 'Today',
                            value: `₱${stats.todayRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                            subtext: `Profit: ₱${stats.todayProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                            icon: '📈',
                            color: '#e8a236'
                        },
                        {
                            label: 'Profit Margin',
                            value: `${stats.profitMargin}%`,
                            subtext: `Total Profit: ₱${stats.totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                            icon: '📊',
                            color: '#4a90c4'
                        },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 16, padding: 24
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ color: '#7a6e60', fontSize: 12, marginTop: 8 }}>{s.label}</div>
                            <div style={{ color: '#7a6e60', fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>{s.subtext}</div>
                        </div>
                    ))}
                </div>

                {/* ── RECENT PRODUCTS TABLE ── */}
                <div style={s.card}>
                    <h2 style={{ color: '#f0e8d8', fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Recent Products</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Product', 'Category', 'Price', 'Tingi Price', 'Stock', 'Status'].map(h => (
                                    <th key={h} style={{
                                        color: '#7a6e60', fontSize: 11, textAlign: 'left',
                                        padding: '0 0 12px', borderBottom: '1px solid #2e2820',
                                        textTransform: 'uppercase', letterSpacing: '.06em'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map(p => (
                                <tr key={p.id}>
                                    <td style={{ padding: '12px 0', color: '#f0e8d8', fontSize: 14 }}>{p.emoji} {p.name}</td>
                                    <td style={{ padding: '12px 0', color: '#7a6e60', fontSize: 13 }}>{p.category?.name ?? '—'}</td>
                                    <td style={{ padding: '12px 0', color: '#e8a236', fontSize: 14 }}>₱{parseFloat(p.unit_price).toFixed(2)}</td>
                                    <td style={{ padding: '12px 0', color: '#5aad7f', fontSize: 14 }}>
                                        {p.tingi_price ? `₱${parseFloat(p.tingi_price).toFixed(2)}` : '—'}
                                    </td>
                                    <td style={{ padding: '12px 0', color: '#f0e8d8', fontSize: 14 }}>{p.stock_quantity}</td>
                                    <td style={{ padding: '12px 0' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                            background: p.stock_quantity <= 0 ? '#3d1a1a' : p.stock_quantity <= p.restock_threshold ? '#3d2e0a' : '#1a3d2a',
                                            color: p.stock_quantity <= 0 ? '#d9534f' : p.stock_quantity <= p.restock_threshold ? '#e8a236' : '#5aad7f',
                                        }}>
                                            {p.stock_quantity <= 0 ? 'Out of Stock' : p.stock_quantity <= p.restock_threshold ? 'Low Stock' : 'In Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── POS (POINT OF SALE) MODAL ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            {showPOS && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 620, maxHeight: '90vh',
                        overflow: 'auto', padding: 32,
                        boxShadow: '0 40px 80px rgba(0,0,0,.6)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ color: '#f0e8d8', fontSize: 20, fontWeight: 800, margin: 0 }}>🛒 New Sale</h3>
                            <button onClick={resetPOS} style={{
                                background: '#221e19', border: '1px solid #2e2820',
                                borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#7a6e60', fontSize: 16
                            }}>✕</button>
                        </div>

                        {/* Items Section */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={s.label}>Items</label>
                            {items.map((item, idx) => (
                                <div key={idx} style={{
                                    background: '#221e19', border: '1px solid #2e2820',
                                    borderRadius: 12, padding: 16, marginBottom: 10
                                }}>
                                    {/* Product selector at remove button */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 10 }}>
                                        {/* Product dropdown */}
                                        <select
                                            value={item.product_id}
                                            onChange={e => updateItem(idx, 'product_id', e.target.value)}
                                            style={s.inp}
                                        >
                                            <option value="">Select product...</option>
                                            {recentProducts.map(p => (
                                                <option key={p.id} value={p.id}>{p.emoji} {p.name} — ₱{parseFloat(p.unit_price).toFixed(2)}</option>
                                            ))}
                                        </select>
                                        {/* Remove item button */}
                                        <button onClick={() => removeItem(idx)} style={{
                                            padding: '8px 12px', borderRadius: 8, border: '1px solid #3a3228',
                                            background: 'rgba(217,83,79,.1)', color: '#d9534f', cursor: 'pointer', fontSize: 13
                                        }}>✕</button>
                                    </div>

                                    {/* Quantity, Tingi, Subtotal Row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
                                        {/* Quantity Input */}
                                        <div>
                                            <label style={s.label}>Qty</label>
                                            <input
                                                type="number" min="1"
                                                value={item.quantity}
                                                onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                style={s.inp}
                                            />
                                        </div>

                                        {/* Tingi Toggle Button */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={s.label}>Tingi?</label>
                                            <button
                                                onClick={() => updateItem(idx, 'is_tingi', !item.is_tingi)}
                                                style={{
                                                    padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                                    border: item.is_tingi ? '1px solid #5aad7f' : '1px solid #2e2820',
                                                    background: item.is_tingi ? 'rgba(90,173,127,.1)' : '#221e19',
                                                    color: item.is_tingi ? '#5aad7f' : '#7a6e60'
                                                }}
                                            >{item.is_tingi ? '✅ Tingi' : 'Per Pack'}</button>
                                        </div>

                                        {/* Subtotal Display */}
                                        <div>
                                            <label style={s.label}>Subtotal</label>
                                            <div style={{
                                                padding: '9px 12px', borderRadius: 8,
                                                background: '#1a1612', border: '1px solid #2e2820',
                                                color: '#e8a236', fontSize: 14, fontWeight: 700
                                            }}>₱{item.total_price.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    {/* Tingi Calculator Hint */}
                                    {item.is_tingi && item.tingi_price > 0 && amountGiven && (
                                        <div style={{
                                            marginTop: 8, padding: '8px 12px', borderRadius: 8,
                                            background: 'rgba(90,173,127,.08)', border: '1px solid rgba(90,173,127,.2)',
                                            color: '#5aad7f', fontSize: 12
                                        }}>
                                            💡 ₱{amountGiven} = {tingiCalc(item)} pcs at ₱{item.tingi_price}/pc
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Item Button */}
                            <button onClick={addItem} style={{
                                width: '100%', padding: '10px', borderRadius: 10,
                                border: '1px dashed #3a3228', background: 'transparent',
                                color: '#7a6e60', cursor: 'pointer', fontSize: 13
                            }}>＋ Add Item</button>
                        </div>

                        {/* Total Amount Display */}
                        <div style={{
                            background: '#221e19', borderRadius: 12, padding: '14px 18px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: 20, border: '1px solid #2e2820'
                        }}>
                            <span style={{ color: '#7a6e60', fontSize: 14 }}>Total Amount</span>
                            <span style={{ color: '#e8a236', fontSize: 24, fontWeight: 800 }}>₱{total.toFixed(2)}</span>
                        </div>

                        {/* Payment Type Selection */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            {['paid', 'utang'].map(type => (
                                <button key={type} onClick={() => setPaymentType(type)} style={{
                                    flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
                                    fontWeight: 700, fontSize: 14,
                                    border: paymentType === type ? 'none' : '1px solid #2e2820',
                                    background: paymentType === type
                                        ? type === 'paid'
                                            ? 'linear-gradient(135deg, #e8a236, #c45c2a)'
                                            : 'linear-gradient(135deg, #d9534f, #a02020)'
                                        : '#221e19',
                                    color: paymentType === type ? '#fff' : '#7a6e60',
                                }}>
                                    {type === 'paid' ? '✅ Bayad' : '📋 Utang'}
                                </button>
                            ))}
                        </div>

                        {/* Amount Given Input (for cash payment) */}
                        {paymentType === 'paid' && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={s.label}>Amount Given (₱)</label>
                                <input
                                    type="number" min="0" step="0.01"
                                    value={amountGiven}
                                    onChange={e => setAmountGiven(e.target.value)}
                                    placeholder="0.00"
                                    style={{ ...s.inp, fontSize: 20, fontWeight: 700, padding: '12px 16px' }}
                                />
                                {amountGiven && parseFloat(amountGiven) >= total && (
                                    <div style={{
                                        marginTop: 8, padding: '10px 14px', borderRadius: 8,
                                        background: 'rgba(90,173,127,.1)', border: '1px solid rgba(90,173,127,.2)',
                                        color: '#5aad7f', fontSize: 15, fontWeight: 700
                                    }}>
                                        Change: ₱{change.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Utang Fields (for credit sale) */}
                        {paymentType === 'utang' && (
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ marginBottom: 12 }}>
                                    <label style={s.label}>Customer Name (optional)</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="e.g. Aling Maria"
                                        style={s.inp}
                                    />
                                </div>
                                <div>
                                    <label style={s.label}>Contact Number (optional)</label>
                                    <input
                                        type="text"
                                        value={contactNumber}
                                        onChange={e => setContactNumber(e.target.value)}
                                        placeholder="e.g. 09123456789"
                                        style={s.inp}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Sale Button */}
                        <button onClick={submitSale} disabled={processing} style={{
                            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                            background: processing ? '#3a3228' : 'linear-gradient(135deg, #e8a236, #c45c2a)',
                            color: processing ? '#7a6e60' : '#fff',
                            fontWeight: 800, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: processing ? 'none' : '0 4px 20px rgba(196,92,42,.4)'
                        }}>
                            {processing ? 'Processing...' : paymentType === 'paid' ? '✅ Complete Sale' : '📋 Record Utang'}
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── CHANGE MODAL (display change amount pagkatapos ng sale) ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            {showChange && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 360, padding: 40, textAlign: 'center',
                        boxShadow: '0 40px 80px rgba(0,0,0,.6)'
                    }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>💰</div>
                        <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                            Sale Complete!
                        </h3>
                        <p style={{ color: '#7a6e60', margin: '0 0 24px', fontSize: 14 }}>Give change to customer</p>
                        <div style={{
                            background: '#221e19', borderRadius: 16, padding: '20px 32px', marginBottom: 28,
                            border: '1px solid #2e2820'
                        }}>
                            <div style={{ color: '#7a6e60', fontSize: 13, marginBottom: 4 }}>Change</div>
                            <div style={{ color: '#5aad7f', fontSize: 48, fontWeight: 800 }}>
                                ₱{changeAmount.toFixed(2)}
                            </div>
                        </div>
                        <button onClick={resetPOS} style={{
                            width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                            color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer'
                        }}>✓ Done</button>
                    </div>
                </div>
            )}
        </div>
    )
}
