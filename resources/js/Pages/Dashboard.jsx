import { useState, useMemo } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Dashboard() {
    const { stats, recentProducts, auth } = usePage().props

    // POS State
    const [showPOS, setShowPOS] = useState(false)
    const [cart, setCart] = useState([])
    const [amountGiven, setAmountGiven] = useState('')
    const [paymentType, setPaymentType] = useState('paid')
    const [customerName, setCustomerName] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [showChange, setShowChange] = useState(false)
    const [changeAmount, setChangeAmount] = useState(0)
    const [processing, setProcessing] = useState(false)
    const [productSearch, setProductSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ['All', ...new Set(recentProducts.map(p => p.category?.name).filter(Boolean))]
        return cats
    }, [recentProducts])

    // Filter products by search and category
    const filteredProducts = useMemo(() => {
        return recentProducts.filter(p => {
            const matchSearch = !productSearch ||
                p.name.toLowerCase().includes(productSearch.toLowerCase())
            const matchCat = selectedCategory === 'All' ||
                p.category?.name === selectedCategory
            return matchSearch && matchCat
        })
    }, [recentProducts, productSearch, selectedCategory])

    // Cart total
    const total = cart.reduce((sum, i) => sum + i.total_price, 0)
    const change = Math.max(0, parseFloat(amountGiven || 0) - total)

    // Add product to cart (tap to add)
    const addToCart = (product) => {
        const existing = cart.find(i => i.product_id === product.id && !i.is_tingi)
        if (existing) {
            // If already in cart, increase quantity
            setCart(cart.map(i =>
                i.product_id === product.id && !i.is_tingi
                    ? { ...i, quantity: i.quantity + 1, total_price: i.unit_price * (i.quantity + 1) }
                    : i
            ))
        } else {
            // Add new item
            const price = parseFloat(product.unit_price || 0)
            setCart([...cart, {
                product_id:     product.id,
                product_name:   product.name,
                emoji:          product.emoji,
                quantity:       1,
                is_tingi:       false,
                unit_price:     price,
                original_price: price,
                tingi_price:    parseFloat(product.tingi_price || price),
                total_price:    price,
            }])
        }
    }

    // Add tingi version
    const addTingi = (product, e) => {
        e.stopPropagation()
        const price = parseFloat(product.tingi_price || product.unit_price || 0)
        const existing = cart.find(i => i.product_id === product.id && i.is_tingi)
        if (existing) {
            setCart(cart.map(i =>
                i.product_id === product.id && i.is_tingi
                    ? { ...i, quantity: i.quantity + 1, total_price: i.unit_price * (i.quantity + 1) }
                    : i
            ))
        } else {
            setCart([...cart, {
                product_id:     product.id,
                product_name:   product.name,
                emoji:          product.emoji,
                quantity:       1,
                is_tingi:       true,
                unit_price:     price,
                original_price: price,
                tingi_price:    price,
                total_price:    price,
            }])
        }
    }

    // Update cart item
    const updateCart = (idx, field, value) => {
        setCart(cart.map((item, i) => {
            if (i !== idx) return item
            const updated = { ...item, [field]: value }
            if (field === 'quantity' || field === 'unit_price') {
                updated.total_price = parseFloat(updated.unit_price) * parseInt(updated.quantity || 1)
            }
            return updated
        }))
    }

    const removeFromCart = (idx) => setCart(cart.filter((_, i) => i !== idx))

    const resetPOS = () => {
        setCart([])
        setAmountGiven('')
        setPaymentType('paid')
        setCustomerName('')
        setContactNumber('')
        setShowPOS(false)
        setShowChange(false)
        setProductSearch('')
        setSelectedCategory('All')
    }

    const submitSale = () => {
        if (cart.length === 0) return alert('Add at least one item!')
        if (paymentType === 'paid' && (!amountGiven || parseFloat(amountGiven) < total)) {
            return alert('Amount given is less than total!')
        }
        setProcessing(true)
        router.post('/sales', {
            items: cart.map(i => ({
                product_id:  i.product_id,
                quantity:    i.quantity,
                is_tingi:    i.is_tingi,
                unit_price:  i.unit_price,
                total_price: i.total_price,
            })),
            total_amount:   total,
            payment_type:   paymentType,
            amount_given:   parseFloat(amountGiven || 0),
            customer_name:  customerName,
            contact_number: contactNumber,
        }, {
            onSuccess: () => {
                setProcessing(false)
                if (paymentType === 'paid') {
                    setChangeAmount(change)
                    setShowPOS(false)
                    setShowChange(true)
                } else {
                    resetPOS()
                    alert('Utang recorded!')
                }
            },
            onError: () => setProcessing(false),
        })
    }

    // Styles
    const s = {
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

            {/* ── TOPBAR ── */}
            <div style={{
                background: '#1a1612', borderBottom: '1px solid #2e2820',
                padding: '0 16px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>🏪</span>
                    <span style={{
                        fontSize: 18, fontWeight: 800,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TindaTrack</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                        { label: '📦', full: 'Products', path: '/products' },
                        { label: '📋', full: 'Utang', path: '/utang' },
                        { label: '🧾', full: 'Sales', path: '/sales' },
                    ].map(btn => (
                        <button key={btn.path} onClick={() => router.get(btn.path)} style={{
                            padding: '6px 10px', borderRadius: 8, border: '1px solid #2e2820',
                            background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                        }}>
                            <span>{btn.label}</span>
                            <span style={{ display: 'none' }}> {btn.full}</span>
                        </button>
                    ))}
                    <button onClick={() => router.post('/logout')} style={{
                        padding: '6px 10px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>↩</button>
                </div>
            </div>

            <div style={{ padding: '16px' }}>

                {/* ── HEADER ── */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 16,
                    flexWrap: 'wrap', gap: 10
                }}>
                    <div>
                        <h1 style={{ color: '#f0e8d8', fontSize: 22, fontWeight: 800, margin: '0 0 2px' }}>
                            Dashboard 📊
                        </h1>
                        <p style={{ color: '#7a6e60', margin: 0, fontSize: 13 }}>
                            Welcome,
                        </p>
                    </div>
                    <button onClick={() => setShowPOS(true)} style={{
                        padding: '12px 24px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(196,92,42,.4)'
                    }}>🛒 New Sale</button>
                </div>

                {/* ── KPI CARDS ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 10, marginBottom: 16
                }}>
                    {[
                        { label: 'Products', value: stats.totalProducts, icon: '📦', color: '#e8a236' },
                        { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: '#d9534f' },
                        { label: 'Categories', value: stats.categories, icon: '🗂️', color: '#5aad7f' },
                        { label: 'Suppliers', value: stats.suppliers, icon: '🚚', color: '#4a90c4' },
                    ].map(k => (
                        <div key={k.label} style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 14, padding: '16px'
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
                            <div style={{ color: '#7a6e60', fontSize: 12, marginTop: 2 }}>{k.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── RECENT PRODUCTS ── */}
                <div style={{
                    background: '#1a1612', border: '1px solid #2e2820',
                    borderRadius: 14, overflow: 'hidden'
                }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2820' }}>
                        <h2 style={{ color: '#f0e8d8', fontSize: 15, fontWeight: 700, margin: 0 }}>
                            Recent Products
                        </h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                                    {['Product', 'Price', 'Stock', 'Status'].map(h => (
                                        <th key={h} style={{
                                            color: '#7a6e60', fontSize: 11, textAlign: 'left',
                                            padding: '10px 14px', borderBottom: '1px solid #2e2820',
                                            textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 500
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentProducts.slice(0, 8).map(p => (
                                    <tr key={p.id}>
                                        <td style={{ padding: '10px 14px', color: '#f0e8d8', fontSize: 13 }}>
                                            {p.emoji} {p.name}
                                        </td>
                                        <td style={{ padding: '10px 14px', color: '#e8a236', fontSize: 13 }}>
                                            ₱{parseFloat(p.unit_price).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '10px 14px', color: '#f0e8d8', fontSize: 13 }}>
                                            {p.stock_quantity}
                                        </td>
                                        <td style={{ padding: '10px 14px' }}>
                                            <span style={{
                                                padding: '3px 8px', borderRadius: 20,
                                                fontSize: 10, fontWeight: 600,
                                                background: p.stock_quantity <= 0 ? '#3d1a1a'
                                                    : p.stock_quantity <= p.restock_threshold ? '#3d2e0a' : '#1a3d2a',
                                                color: p.stock_quantity <= 0 ? '#d9534f'
                                                    : p.stock_quantity <= p.restock_threshold ? '#e8a236' : '#5aad7f',
                                            }}>
                                                {p.stock_quantity <= 0 ? 'Out' :
                                                    p.stock_quantity <= p.restock_threshold ? 'Low' : 'OK'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════ */}
            {/* ── POS MODAL — NEW DESIGN ── */}
            {/* ══════════════════════════════════════════ */}
            {showPOS && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: '#0f0d0a',
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* POS Header */}
                    <div style={{
                        background: '#1a1612', borderBottom: '1px solid #2e2820',
                        padding: '12px 16px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexShrink: 0
                    }}>
                        <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 800, margin: 0 }}>
                            🛒 New Sale
                        </h3>
                        <button onClick={resetPOS} style={{
                            background: '#221e19', border: '1px solid #2e2820',
                            borderRadius: 8, width: 34, height: 34,
                            cursor: 'pointer', color: '#7a6e60', fontSize: 18
                        }}>✕</button>
                    </div>

                    {/* POS Body — split layout on desktop, stacked on mobile */}
                    <div style={{
                        flex: 1, display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Product Grid (top / left) */}
                        <div style={{
                            flex: 1, overflow: 'auto', padding: 12,
                            borderBottom: '1px solid #2e2820'
                        }}>
                            {/* Search + Category Filter */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                                <input
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    placeholder="🔍 Search product..."
                                    style={{ ...s.inp, flex: 1, minWidth: 150 }}
                                    autoFocus
                                />
                            </div>

                            {/* Category Pills */}
                            <div style={{
                                display: 'flex', gap: 6, marginBottom: 12,
                                overflowX: 'auto', paddingBottom: 4
                            }}>
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                        padding: '5px 12px', borderRadius: 999,
                                        border: selectedCategory === cat
                                            ? '1px solid rgba(232,162,54,.5)'
                                            : '1px solid #2e2820',
                                        background: selectedCategory === cat
                                            ? 'rgba(232,162,54,.12)' : '#221e19',
                                        color: selectedCategory === cat ? '#e8a236' : '#7a6e60',
                                        cursor: 'pointer', fontSize: 12,
                                        whiteSpace: 'nowrap', flexShrink: 0
                                    }}>{cat}</button>
                                ))}
                            </div>

                            {/* Product Cards Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: 8
                            }}>
                                {filteredProducts.map(p => {
                                    const inCart = cart.find(i => i.product_id === p.id)
                                    const outOfStock = p.stock_quantity <= 0
                                    const hasTingi = p.tingi_price && parseFloat(p.tingi_price) > 0

                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => !outOfStock && addToCart(p)}
                                            style={{
                                                background: inCart ? 'rgba(232,162,54,.1)' : '#1a1612',
                                                border: inCart
                                                    ? '2px solid rgba(232,162,54,.4)'
                                                    : '1px solid #2e2820',
                                                borderRadius: 12, padding: '10px 8px',
                                                cursor: outOfStock ? 'not-allowed' : 'pointer',
                                                opacity: outOfStock ? 0.4 : 1,
                                                textAlign: 'center',
                                                transition: 'all .15s',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Cart badge */}
                                            {inCart && (
                                                <div style={{
                                                    position: 'absolute', top: -6, right: -6,
                                                    background: '#e8a236', color: '#fff',
                                                    borderRadius: '50%', width: 20, height: 20,
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: 11, fontWeight: 700
                                                }}>
                                                    {cart.filter(i => i.product_id === p.id)
                                                        .reduce((s, i) => s + i.quantity, 0)}
                                                </div>
                                            )}

                                            <div style={{ fontSize: 28, marginBottom: 4 }}>{p.emoji}</div>
                                            <div style={{
                                                color: '#f0e8d8', fontSize: 11, fontWeight: 600,
                                                marginBottom: 3, lineHeight: 1.3,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>{p.name}</div>
                                            <div style={{ color: '#e8a236', fontSize: 12, fontWeight: 700 }}>
                                                ₱{parseFloat(p.unit_price).toFixed(2)}
                                            </div>

                                            {/* Tingi button */}
                                            {hasTingi && !outOfStock && (
                                                <button
                                                    onClick={(e) => addTingi(p, e)}
                                                    style={{
                                                        marginTop: 5, padding: '3px 8px',
                                                        borderRadius: 6, border: '1px solid rgba(90,173,127,.3)',
                                                        background: 'rgba(90,173,127,.1)',
                                                        color: '#5aad7f', fontSize: 10,
                                                        cursor: 'pointer', width: '100%'
                                                    }}
                                                >
                                                    +tingi ₱{parseFloat(p.tingi_price).toFixed(2)}
                                                </button>
                                            )}

                                            {outOfStock && (
                                                <div style={{ color: '#d9534f', fontSize: 10, marginTop: 3 }}>
                                                    Out of stock
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {filteredProducts.length === 0 && (
                                    <div style={{
                                        gridColumn: '1/-1', textAlign: 'center',
                                        color: '#7a6e60', padding: 32, fontSize: 13
                                    }}>
                                        No products found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cart (bottom) */}
                        <div style={{
                            background: '#1a1612',
                            maxHeight: '45vh', overflow: 'auto',
                            padding: 12, flexShrink: 0
                        }}>
                            <div style={{
                                color: '#7a6e60', fontSize: 11,
                                textTransform: 'uppercase', letterSpacing: '.07em',
                                marginBottom: 8
                            }}>
                                Cart {cart.length > 0 && `(${cart.length} item${cart.length > 1 ? 's' : ''})`}
                            </div>

                            {cart.length === 0 && (
                                <div style={{
                                    textAlign: 'center', color: '#4a4238',
                                    fontSize: 13, padding: '16px 0'
                                }}>
                                    Tap a product to add it to cart
                                </div>
                            )}

                            {/* Cart Items */}
                            {cart.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: 8, marginBottom: 8,
                                    background: '#221e19', borderRadius: 10,
                                    padding: '8px 10px', border: '1px solid #2e2820'
                                }}>
                                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: '#f0e8d8', fontSize: 12, fontWeight: 500,
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.product_name}
                                            {item.is_tingi && (
                                                <span style={{
                                                    marginLeft: 4, fontSize: 9,
                                                    color: '#5aad7f', background: 'rgba(90,173,127,.1)',
                                                    padding: '1px 5px', borderRadius: 4
                                                }}>tingi</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                                            {/* Qty controls */}
                                            <button onClick={() => {
                                                if (item.quantity <= 1) removeFromCart(idx)
                                                else updateCart(idx, 'quantity', item.quantity - 1)
                                            }} style={{
                                                width: 22, height: 22, borderRadius: 6,
                                                border: '1px solid #2e2820', background: '#1a1612',
                                                color: '#f0e8d8', cursor: 'pointer', fontSize: 14,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>−</button>
                                            <span style={{ color: '#f0e8d8', fontSize: 13, minWidth: 20, textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button onClick={() => updateCart(idx, 'quantity', item.quantity + 1)} style={{
                                                width: 22, height: 22, borderRadius: 6,
                                                border: '1px solid #2e2820', background: '#1a1612',
                                                color: '#f0e8d8', cursor: 'pointer', fontSize: 14,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>+</button>
                                            {/* Price override */}
                                            <span style={{ color: '#7a6e60', fontSize: 11 }}>×</span>
                                            <span style={{ color: '#7a6e60', fontSize: 11 }}>₱</span>
                                            <input
                                                type="number" min="0" step="0.01"
                                                value={item.unit_price}
                                                onChange={e => updateCart(idx, 'unit_price', parseFloat(e.target.value || 0))}
                                                style={{
                                                    width: 56, padding: '2px 6px', borderRadius: 6,
                                                    background: '#1a1612', border: '1px solid #2e2820',
                                                    color: '#e8a236', fontSize: 12, outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ color: '#e8a236', fontWeight: 700, fontSize: 13 }}>
                                            ₱{item.total_price.toFixed(2)}
                                        </div>
                                        <button onClick={() => removeFromCart(idx)} style={{
                                            background: 'none', border: 'none',
                                            color: '#d9534f', cursor: 'pointer', fontSize: 12, marginTop: 2
                                        }}>✕</button>
                                    </div>
                                </div>
                            ))}

                            {cart.length > 0 && (
                                <>
                                    {/* Total */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', padding: '10px 0',
                                        borderTop: '1px solid #2e2820', marginTop: 4
                                    }}>
                                        <span style={{ color: '#7a6e60', fontSize: 14 }}>Total</span>
                                        <span style={{ color: '#e8a236', fontSize: 22, fontWeight: 800 }}>
                                            ₱{total.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Payment Type */}
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                        {['paid', 'utang'].map(type => (
                                            <button key={type} onClick={() => setPaymentType(type)} style={{
                                                flex: 1, padding: '10px', borderRadius: 10,
                                                cursor: 'pointer', fontWeight: 700, fontSize: 13,
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

                                    {/* Amount Given */}
                                    {paymentType === 'paid' && (
                                        <div style={{ marginBottom: 10 }}>
                                            <label style={s.label}>Amount Given (₱)</label>
                                            <input
                                                type="number" min="0" step="0.01"
                                                value={amountGiven}
                                                onChange={e => setAmountGiven(e.target.value)}
                                                placeholder="0.00"
                                                style={{ ...s.inp, fontSize: 18, fontWeight: 700 }}
                                            />
                                            {amountGiven && parseFloat(amountGiven) >= total && (
                                                <div style={{
                                                    marginTop: 6, padding: '8px 12px', borderRadius: 8,
                                                    background: 'rgba(90,173,127,.1)',
                                                    border: '1px solid rgba(90,173,127,.2)',
                                                    color: '#5aad7f', fontSize: 14, fontWeight: 700
                                                }}>
                                                    Change: ₱{change.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Utang fields */}
                                    {paymentType === 'utang' && (
                                        <div style={{ marginBottom: 10 }}>
                                            <input
                                                type="text" value={customerName}
                                                onChange={e => setCustomerName(e.target.value)}
                                                placeholder="Customer name (optional)"
                                                style={{ ...s.inp, marginBottom: 6 }}
                                            />
                                            <input
                                                type="text" value={contactNumber}
                                                onChange={e => setContactNumber(e.target.value)}
                                                placeholder="Contact number (optional)"
                                                style={s.inp}
                                            />
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button onClick={submitSale} disabled={processing} style={{
                                        width: '100%', padding: '13px', borderRadius: 12,
                                        border: 'none',
                                        background: processing ? '#3a3228'
                                            : 'linear-gradient(135deg, #e8a236, #c45c2a)',
                                        color: processing ? '#7a6e60' : '#fff',
                                        fontWeight: 800, fontSize: 15,
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        boxShadow: processing ? 'none' : '0 4px 20px rgba(196,92,42,.4)'
                                    }}>
                                        {processing ? 'Processing...'
                                            : paymentType === 'paid' ? '✅ Complete Sale' : '📋 Record Utang'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── CHANGE MODAL ── */}
            {showChange && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 320, padding: 36, textAlign: 'center',
                        boxShadow: '0 40px 80px rgba(0,0,0,.6)'
                    }}>
                        <div style={{ fontSize: 52, marginBottom: 12 }}>💰</div>
                        <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>
                            Sale Complete!
                        </h3>
                        <p style={{ color: '#7a6e60', margin: '0 0 20px', fontSize: 13 }}>
                            Give change to customer
                        </p>
                        <div style={{
                            background: '#221e19', borderRadius: 14, padding: '18px 28px',
                            marginBottom: 24, border: '1px solid #2e2820'
                        }}>
                            <div style={{ color: '#7a6e60', fontSize: 12, marginBottom: 4 }}>Change</div>
                            <div style={{ color: '#5aad7f', fontSize: 44, fontWeight: 800 }}>
                                ₱{changeAmount.toFixed(2)}
                            </div>
                        </div>
                        <button onClick={resetPOS} style={{
                            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                            color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer'
                        }}>✓ Done</button>
                    </div>
                </div>
            )}
        </div>
    )
}