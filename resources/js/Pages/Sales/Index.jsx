import { Fragment, useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// Sales history page - tracks every sale transaction and revenue totals
export default function SalesHistory() {
    const { sales, summary } = usePage().props
    const [search, setSearch] = useState('')
    const [paymentFilter, setPaymentFilter] = useState('all')
    const [expanded, setExpanded] = useState(null)

    const money = (value) => `₱${parseFloat(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`

    const filteredSales = useMemo(() => sales.filter((sale) => {
        const query = search.toLowerCase()
        const matchesSearch = !query
            || sale.receipt_no.toLowerCase().includes(query)
            || sale.cashier.toLowerCase().includes(query)
            || (sale.customer_name || '').toLowerCase().includes(query)
            || sale.items.some((item) => item.product.toLowerCase().includes(query))
        const matchesPayment = paymentFilter === 'all' || sale.payment_type === paymentFilter

        return matchesSearch && matchesPayment
    }), [sales, search, paymentFilter])

    const navButton = {
        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13,
    }

    const card = {
        background: '#1a1612', border: '1px solid #2e2820',
        borderRadius: 16, padding: 24,
    }

    const input = {
        padding: '11px 14px', borderRadius: 10,
        background: '#221e19', border: '1px solid #2e2820',
        color: '#f0e8d8', fontSize: 13, outline: 'none', boxSizing: 'border-box',
    }

    const badgeStyle = (paymentType) => paymentType === 'paid'
        ? { background: 'rgba(90,173,127,.12)', color: '#5aad7f', border: '1px solid rgba(90,173,127,.25)' }
        : { background: 'rgba(232,162,54,.12)', color: '#e8a236', border: '1px solid rgba(232,162,54,.25)' }

    return (
        <div style={{ minHeight: '100vh', background: '#0f0d0a', fontFamily: "'DM Sans', sans-serif" }}>
            {/* Top navigation */}
            <div style={{
                background: '#1a1612', borderBottom: '1px solid #2e2820',
                padding: '0 32px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🏪</span>
                    <span style={{
                        fontSize: 20, fontWeight: 800,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>TindaTrack</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.get('/dashboard')} style={navButton}>📊 Dashboard</button>
                    <button onClick={() => router.get('/products')} style={navButton}>📦 Products</button>
                    <button onClick={() => router.get('/utang')} style={navButton}>📋 Utang</button>
                    <button onClick={() => router.post('/logout')} style={navButton}>Logout</button>
                </div>
            </div>

            <div style={{ padding: 32 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>🧾 Sale History</h1>
                        <p style={{ color: '#7a6e60', margin: 0, fontSize: 14 }}>Track every sale, payment type, and revenue total.</p>
                    </div>
                    <button onClick={() => router.get('/dashboard')} style={{
                        padding: '12px 22px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(196,92,42,.35)',
                    }}>🛒 New Sale</button>
                </div>

                {/* Revenue summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { label: 'Total Sales', value: summary.totalSales, icon: '🧾', color: '#e8a236' },
                        { label: 'Total Revenue', value: money(summary.totalRevenue), icon: '💰', color: '#5aad7f' },
                        { label: 'Cash/Paid Revenue', value: money(summary.paidRevenue), icon: '✅', color: '#5aad7f' },
                        { label: 'Utang Revenue', value: money(summary.utangRevenue), icon: '📋', color: '#e8a236' },
                        { label: 'Today Revenue', value: money(summary.todayRevenue), icon: '📈', color: '#4a90c4' },
                    ].map((item) => (
                        <div key={item.label} style={card}>
                            <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                            <div style={{ color: item.color, fontSize: 22, fontWeight: 800 }}>{item.value}</div>
                            <div style={{ color: '#7a6e60', fontSize: 12, marginTop: 6 }}>{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ ...card, display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search receipt, cashier, customer, or product..."
                        style={{ ...input, flex: 1 }}
                    />
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={input}>
                        <option value="all">All payments</option>
                        <option value="paid">Paid only</option>
                        <option value="utang">Utang only</option>
                    </select>
                </div>

                {/* Sales table */}
                <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#15120f' }}>
                                {['Receipt', 'Date', 'Cashier/Customer', 'Items', 'Payment', 'Revenue', ''].map((header) => (
                                    <th key={header} style={{
                                        color: '#7a6e60', fontSize: 11, textAlign: 'left',
                                        padding: '14px 18px', borderBottom: '1px solid #2e2820',
                                        textTransform: 'uppercase', letterSpacing: '.06em',
                                    }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ color: '#7a6e60', padding: 36, textAlign: 'center' }}>
                                        No sales found for the current filters.
                                    </td>
                                </tr>
                            )}
                            {filteredSales.map((sale) => {
                                const isOpen = expanded === sale.id

                                return (
                                    <Fragment key={sale.id}>
                                        <tr style={{ borderBottom: isOpen ? 'none' : '1px solid rgba(46,40,32,.55)' }}>
                                            <td style={{ padding: '16px 18px', color: '#f0e8d8', fontWeight: 800, fontSize: 13 }}>{sale.receipt_no}</td>
                                            <td style={{ padding: '16px 18px', color: '#7a6e60', fontSize: 13 }}>{sale.created_at}</td>
                                            <td style={{ padding: '16px 18px' }}>
                                                <div style={{ color: '#f0e8d8', fontSize: 13, fontWeight: 600 }}>{sale.cashier}</div>
                                                {sale.customer_name && <div style={{ color: '#7a6e60', fontSize: 12 }}>Customer: {sale.customer_name}</div>}
                                            </td>
                                            <td style={{ padding: '16px 18px', color: '#f0e8d8', fontSize: 13 }}>{sale.items_count} pcs</td>
                                            <td style={{ padding: '16px 18px' }}>
                                                <span style={{
                                                    ...badgeStyle(sale.payment_type),
                                                    display: 'inline-block', padding: '5px 11px', borderRadius: 999,
                                                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                                                }}>{sale.payment_type}</span>
                                            </td>
                                            <td style={{ padding: '16px 18px', color: '#5aad7f', fontSize: 15, fontWeight: 800 }}>{money(sale.total_amount)}</td>
                                            <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                                                <button onClick={() => setExpanded(isOpen ? null : sale.id)} style={{
                                                    padding: '7px 12px', borderRadius: 8, border: '1px solid #2e2820',
                                                    background: '#221e19', color: '#e8a236', cursor: 'pointer', fontSize: 12,
                                                }}>{isOpen ? 'Hide' : 'Details'}</button>
                                            </td>
                                        </tr>
                                        {isOpen && (
                                            <tr key={`${sale.id}-details`} style={{ borderBottom: '1px solid rgba(46,40,32,.55)' }}>
                                                <td colSpan="7" style={{ padding: '0 18px 18px' }}>
                                                    <div style={{ background: '#15120f', border: '1px solid #2e2820', borderRadius: 12, padding: 16 }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                                                            <div style={{ color: '#7a6e60', fontSize: 12 }}>Amount Given: <strong style={{ color: '#f0e8d8' }}>{money(sale.amount_given)}</strong></div>
                                                            <div style={{ color: '#7a6e60', fontSize: 12 }}>Change: <strong style={{ color: '#f0e8d8' }}>{money(sale.change_amount)}</strong></div>
                                                            <div style={{ color: '#7a6e60', fontSize: 12 }}>Line Items: <strong style={{ color: '#f0e8d8' }}>{sale.items.length}</strong></div>
                                                        </div>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <tbody>
                                                                {sale.items.map((item, idx) => (
                                                                    <tr key={`${sale.id}-${idx}`}>
                                                                        <td style={{ padding: '8px 0', color: '#f0e8d8', fontSize: 13 }}>{item.emoji} {item.product}</td>
                                                                        <td style={{ padding: '8px 0', color: '#7a6e60', fontSize: 12 }}>{item.is_tingi ? 'Tingi' : 'Pack'}</td>
                                                                        <td style={{ padding: '8px 0', color: '#7a6e60', fontSize: 12 }}>Qty: {item.qty}</td>
                                                                        <td style={{ padding: '8px 0', color: '#7a6e60', fontSize: 12 }}>Price: {money(item.price)}</td>
                                                                        <td style={{ padding: '8px 0', color: '#e8a236', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>{money(item.total)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
