import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// UtangPage - nag-track sa customer credits/installment payments
// "Utang" = debt/credit sa Filipino language
// Shows outstanding balances og payment history

export default function UtangPage() {
    const { utangs } = usePage().props
    const [payModal, setPayModal] = useState(null)      // Utang record para sa payment
    const [payAmount, setPayAmount] = useState('')      // Amount being paid
    const [search, setSearch] = useState('')            // Search query
    const [filterStatus, setFilterStatus] = useState('all') // Status filter

    // Filter utangs based sa search og status
    const filtered = utangs.filter(u => {
        const matchSearch = u.customer_name.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || u.status === filterStatus
        return matchSearch && matchStatus
    })

    // Calculate total unpaid amount - important business metric
    const totalUnpaid = utangs
        .filter(u => u.status !== 'paid')
        .reduce((sum, u) => sum + parseFloat(u.remaining), 0)

    // Submit payment para sa utang
    const submitPayment = () => {
        if (!payAmount || parseFloat(payAmount) <= 0) return alert('Enter a valid amount!')
        router.post(`/utang/${payModal.id}/pay`, {
            paid_amount: parseFloat(payAmount)
        }, {
            onSuccess: () => {
                setPayModal(null)
                setPayAmount('')
            }
        })
    }

    // Get status color based sa payment status
    const statusColor = (status) => {
        if (status === 'paid')    return { bg: '#1a3d2a', color: '#5aad7f', label: 'Paid' }
        if (status === 'partial') return { bg: '#3d2e0a', color: '#e8a236', label: 'Partial' }
        return { bg: '#3d1a1a', color: '#d9534f', label: 'Unpaid' }
    }

    const inp = {
        padding: '10px 14px', borderRadius: 8,
        background: '#221e19', border: '1px solid #2e2820',
        color: '#f0e8d8', fontSize: 13, outline: 'none',
        width: '100%', boxSizing: 'border-box'
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
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.get('/dashboard')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📊 Dashboard</button>
                    <button onClick={() => router.get('/products')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📦 Products</button>
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
                        <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>📋 Utang</h1>
                        <p style={{ color: '#7a6e60', margin: 0, fontSize: 14 }}>Track customer credits and payments</p>
                    </div>
                    {/* Total unpaid summary - important KPI */}
                    <div style={{
                        background: '#3d1a1a', border: '1px solid rgba(217,83,79,.3)',
                        borderRadius: 14, padding: '14px 24px', textAlign: 'right'
                    }}>
                        <div style={{ color: '#d9534f', fontSize: 12, marginBottom: 4 }}>TOTAL UNPAID</div>
                        <div style={{ color: '#f0e8d8', fontSize: 28, fontWeight: 800 }}>₱{totalUnpaid.toFixed(2)}</div>
                    </div>
                </div>

                {/* ── FILTERS ── */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍  Search customer name..."
                        style={{ ...inp, maxWidth: 280 }}
                    />
                    {['all', 'unpaid', 'partial', 'paid'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} style={{
                            padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                            border: filterStatus === s ? '1px solid rgba(232,162,54,.4)' : '1px solid #2e2820',
                            background: filterStatus === s ? 'rgba(232,162,54,.1)' : '#1a1612',
                            color: filterStatus === s ? '#e8a236' : '#7a6e60',
                            textTransform: 'capitalize'
                        }}>{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
                    ))}
                </div>

                {/* ── UTANG LIST ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.length === 0 && (
                        <div style={{
                            background: '#1a1612', border: '1px solid #2e2820',
                            borderRadius: 16, padding: 48, textAlign: 'center', color: '#7a6e60'
                        }}>
                            {search ? 'No results found.' : 'No utang records yet! 🎉'}
                        </div>
                    )}

                    {filtered.map(u => {
                        const sc = statusColor(u.status)
                        // Calculate payment percentage for progress bar
                        const pct = (parseFloat(u.paid_amount) / parseFloat(u.total_amount)) * 100
                        return (
                            <div key={u.id} style={{
                                background: '#1a1612', border: '1px solid #2e2820',
                                borderRadius: 16, padding: 24,
                                transition: 'border-color .2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    {/* Customer Info */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10,
                                                background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 16, fontWeight: 700, color: '#fff'
                                            }}>
                                                {u.customer_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ color: '#f0e8d8', fontWeight: 700, fontSize: 15 }}>{u.customer_name}</div>
                                                {u.contact_number && (
                                                    <div style={{ color: '#7a6e60', fontSize: 12 }}>📱 {u.contact_number}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ color: '#7a6e60', fontSize: 12, marginTop: 4 }}>🕐 {u.created_at}</div>
                                    </div>

                                    {/* Amount & Status */}
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '4px 12px',
                                            borderRadius: 20, fontSize: 11, fontWeight: 700,
                                            background: sc.bg, color: sc.color, marginBottom: 8
                                        }}>{sc.label}</span>
                                        <div style={{ color: '#f0e8d8', fontSize: 22, fontWeight: 800 }}>
                                            ₱{parseFloat(u.remaining).toFixed(2)}
                                        </div>
                                        <div style={{ color: '#7a6e60', fontSize: 12 }}>
                                            of ₱{parseFloat(u.total_amount).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar - shows payment progress */}
                                <div style={{
                                    height: 6, background: '#2e2820', borderRadius: 99, marginBottom: 16, overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%', borderRadius: 99,
                                        width: `${pct}%`,
                                        background: pct >= 100 ? '#5aad7f' : pct > 0 ? '#e8a236' : '#d9534f',
                                        transition: 'width .4s'
                                    }} />
                                </div>

                                {/* Items Purchased */}
                                <div style={{
                                    background: '#221e19', borderRadius: 10, padding: 12, marginBottom: 16
                                }}>
                                    {u.items.map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            padding: '5px 0',
                                            borderBottom: i < u.items.length - 1 ? '1px solid #2e2820' : 'none'
                                        }}>
                                            <span style={{ color: '#f0e8d8', fontSize: 13 }}>
                                                {item.emoji} {item.product} {item.is_tingi ? '(tingi)' : ''}
                                                <span style={{ color: '#7a6e60' }}> × {item.qty}</span>
                                            </span>
                                            <span style={{ color: '#e8a236', fontSize: 13, fontWeight: 600 }}>
                                                ₱{parseFloat(item.total).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pay Button - only show if not fully paid */}
                                {u.status !== 'paid' && (
                                    <button onClick={() => { setPayModal(u); setPayAmount('') }} style={{
                                        padding: '10px 20px', borderRadius: 10, border: 'none',
                                        background: 'linear-gradient(135deg, #5aad7f, #3a8a5f)',
                                        color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                                    }}>💵 Record Payment</button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ══════════════════════════════════════════ */}
            {/* ── PAYMENT MODAL ── */}
            {/* ══════════════════════════════════════════ */}
            {payModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <div style={{
                        background: '#1a1612', border: '1px solid #3a3228',
                        borderRadius: 20, width: 400, padding: 32,
                        boxShadow: '0 40px 80px rgba(0,0,0,.6)'
                    }}>
                        <h3 style={{ color: '#f0e8d8', fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>
                            💵 Record Payment
                        </h3>
                        <p style={{ color: '#7a6e60', fontSize: 13, margin: '0 0 24px' }}>
                            {payModal.customer_name} — Remaining: <span style={{ color: '#d9534f', fontWeight: 700 }}>₱{parseFloat(payModal.remaining).toFixed(2)}</span>
                        </p>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                color: '#7a6e60', fontSize: 11, textTransform: 'uppercase',
                                letterSpacing: '.07em', display: 'block', marginBottom: 8
                            }}>Amount Paid (₱)</label>
                            <input
                                type="number" min="0" step="0.01"
                                value={payAmount}
                                onChange={e => setPayAmount(e.target.value)}
                                placeholder="0.00"
                                style={{ ...inp, fontSize: 20, fontWeight: 700 }}
                                autoFocus
                            />
                            {/* Quick fill buttons */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                {[payModal.remaining, payModal.remaining / 2].filter(v => v > 0).map((v, i) => (
                                    <button key={i} onClick={() => setPayAmount(v.toFixed(2))} style={{
                                        padding: '6px 12px', borderRadius: 8, border: '1px solid #2e2820',
                                        background: '#221e19', color: '#e8a236', cursor: 'pointer', fontSize: 12
                                    }}>₱{parseFloat(v).toFixed(2)}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setPayModal(null)} style={{
                                flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #2e2820',
                                background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                            }}>Cancel</button>
                            <button onClick={submitPayment} style={{
                                flex: 2, padding: '11px', borderRadius: 10, border: 'none',
                                background: 'linear-gradient(135deg, #5aad7f, #3a8a5f)',
                                color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                            }}>✅ Confirm Payment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
