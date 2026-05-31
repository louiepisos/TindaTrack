import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function SalesHistory() {
    const { sales, summary } = usePage().props
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [expanded, setExpanded] = useState(null)

    const filtered = sales.filter(s => {
    const matchSearch = !search ||
        s.customer?.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toString().includes(search)
    const matchFilter = filter === 'all' || s.payment_type === filter
    return matchSearch && matchFilter
})

    const inp = {
        padding: '9px 14px', borderRadius: 8,
        background: '#221e19', border: '1px solid #2e2820',
        color: '#f0e8d8', fontSize: 13, outline: 'none',
        boxSizing: 'border-box'
    }

    return (
        <div className="app-page sales-page" style={{ minHeight: '100vh', background: '#0f0d0a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* Topbar */}
            <div className="app-topbar" style={{
                background: '#1a1612', borderBottom: '1px solid #2e2820',
                padding: '0 32px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div className="app-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🏪</span>
                    <span style={{
                        fontSize: 20, fontWeight: 800,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TindaTrack</span>
                </div>
                <div className="app-nav" style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.get('/dashboard')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📊 <span>Dashboard</span></button>
                    <button onClick={() => router.get('/products')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📦 <span>Products</span></button>
                    <button onClick={() => router.get('/utang')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📋 <span>Utang</span></button>
                    <button onClick={() => router.post('/logout')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>↩ <span>Logout</span></button>
                </div>
            </div>

            <div className="app-main" style={{ padding: 32 }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>
                        🧾 Sales History
                    </h1>
                    <p style={{ color: '#7a6e60', margin: 0, fontSize: 14 }}>
                        {sales.length} total transactions
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="responsive-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                        { label: 'Total Sales',    value: summary.totalSales,   icon: '🧾', color: '#e8a236', prefix: '' },
                        { label: 'Total Revenue',  value: summary.totalRevenue, icon: '💰', color: '#5aad7f', prefix: '₱' },
                        { label: "Today's Revenue",value: summary.todayRevenue, icon: '📈', color: '#4a90c4', prefix: '₱' },
                        { label: 'Utang Amount',   value: summary.totalUtang,   icon: '📋', color: '#d9534f', prefix: '₱' },
                    ].map(c => (
                        <div key={c.label} className="summary-card" style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 16, padding: 24
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>
                                {c.prefix}{typeof c.value === 'number'
                                    ? c.prefix
                                        ? parseFloat(c.value).toLocaleString('en-PH', { minimumFractionDigits: 2 })
                                        : c.value
                                    : c.value}
                            </div>
                            <div style={{ color: '#7a6e60', fontSize: 13, marginTop: 4 }}>{c.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="responsive-filter-bar" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="🔍  Search by Sale ID..."
                      className="responsive-filter-input" style={{ ...inp, flex: 1, minWidth: 240 }}
                    />
                    {['all', 'paid', 'utang'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                            fontSize: 13, fontWeight: 500, textTransform: 'capitalize',
                            border: filter === f ? '1px solid rgba(232,162,54,.4)' : '1px solid #2e2820',
                            background: filter === f ? 'rgba(232,162,54,.1)' : '#1a1612',
                            color: filter === f ? '#e8a236' : '#7a6e60',
                        }}>
                            {f === 'all' ? 'All' : f === 'paid' ? '✅ Paid' : '📋 Utang'}
                        </button>
                    ))}
                </div>

                {/* Sales List */}
                <div className="responsive-record-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.length === 0 && (
                        <div style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 16, padding: 48, textAlign: 'center', color: '#7a6e60'
                        }}>
                            No sales found.
                        </div>
                    )}

                    {filtered.map(sale => (
                        <div key={sale.id} className="responsive-record-card sales-record-card" style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 14, overflow: 'hidden',
                            transition: 'border-color .2s'
                        }}>
                            {/* Sale Row */}
                            <div
                                onClick={() => setExpanded(expanded === sale.id ? null : sale.id)}
                                className="sales-row-toggle"
                                style={{
                                    padding: '16px 24px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', gap: 16
                                }}
                            >
                                {/* Left: ID + Time */}
                                <div className="sales-row-left" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: sale.payment_type === 'paid'
                                            ? 'rgba(90,173,127,.12)' : 'rgba(217,83,79,.12)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 18, flexShrink: 0
                                    }}>
                                        {sale.payment_type === 'paid' ? '✅' : '📋'}
                                    </div>
                                    <div>
                                        <div style={{ color: '#f0e8d8', fontWeight: 600, fontSize: 14 }}>
                                            Sale #{sale.id}
                                            {sale.customer && (
                                                <span style={{ color: '#7a6e60', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
                                                    — {sale.customer}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: '#7a6e60', fontSize: 12, marginTop: 2 }}>
                                            {sale.created_at}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Amount + Badge */}
                                <div className="sales-row-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 20,
                                        fontSize: 11, fontWeight: 600,
                                        background: sale.payment_type === 'paid'
                                            ? 'rgba(90,173,127,.12)' : 'rgba(217,83,79,.12)',
                                        color: sale.payment_type === 'paid' ? '#5aad7f' : '#d9534f',
                                        border: `1px solid ${sale.payment_type === 'paid'
                                            ? 'rgba(90,173,127,.25)' : 'rgba(217,83,79,.25)'}`,
                                    }}>
                                        {sale.payment_type === 'paid' ? 'Paid' : 'Utang'}
                                    </span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#e8a236', fontWeight: 800, fontSize: 16 }}>
                                            ₱{parseFloat(sale.total_amount).toFixed(2)}
                                        </div>
                                        {sale.payment_type === 'paid' && (
                                            <div style={{ color: '#7a6e60', fontSize: 11 }}>
                                                Change: ₱{parseFloat(sale.change_amount).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{ color: '#4a4238', fontSize: 18 }}>
                                        {expanded === sale.id ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Items */}
                            {expanded === sale.id && (
                                <div className="sales-expanded-panel" style={{
                                    borderTop: '1px solid #2e2820',
                                    padding: '14px 24px', background: '#161310'
                                }}>
                                    <div style={{ color: '#7a6e60', fontSize: 11, marginBottom: 10,
                                        textTransform: 'uppercase', letterSpacing: '.06em' }}>
                                        Items Purchased
                                    </div>
                                    {sale.items.map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', padding: '8px 0',
                                            borderBottom: i < sale.items.length - 1
                                                ? '1px solid rgba(46,40,32,.5)' : 'none'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 16 }}>{item.emoji}</span>
                                                <div>
                                                    <span style={{ color: '#f0e8d8', fontSize: 13 }}>
                                                        {item.product}
                                                    </span>
                                                    {item.is_tingi && (
                                                        <span style={{
                                                            marginLeft: 6, fontSize: 10, fontWeight: 600,
                                                            color: '#5aad7f', background: 'rgba(90,173,127,.1)',
                                                            padding: '2px 6px', borderRadius: 4
                                                        }}>tingi</span>
                                                    )}
                                                    <div style={{ color: '#7a6e60', fontSize: 11 }}>
                                                        {item.quantity} × ₱{parseFloat(item.unit_price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{ color: '#e8a236', fontWeight: 600, fontSize: 13 }}>
                                                ₱{parseFloat(item.total).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Total row */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        marginTop: 12, paddingTop: 12,
                                        borderTop: '1px solid #2e2820'
                                    }}>
                                        <span style={{ color: '#7a6e60', fontSize: 13 }}>Total</span>
                                        <span style={{ color: '#e8a236', fontWeight: 800, fontSize: 15 }}>
                                            ₱{parseFloat(sale.total_amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}