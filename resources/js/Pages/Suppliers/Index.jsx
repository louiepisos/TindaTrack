import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

// SuppliersPage - nag-manage ng supplier information
// Suppliers ay companies na nag-provide ng products sa store

export default function Suppliers() {
    const { suppliers } = usePage().props
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({
        name: '', contact_person: '', email: '', phone: '', address: '', city: '', notes: ''
    })

    // Filter suppliers based sa search
    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(search.toLowerCase()))
    )

    // Open add supplier modal
    const openAdd = () => {
        setForm({ name: '', contact_person: '', email: '', phone: '', address: '', city: '', notes: '' })
        setShowModal(true)
    }

    // Save supplier
    const save = () => {
        if (!form.name.trim()) {
            return alert('Supplier name is required')
        }
        router.post('/suppliers', form, { onSuccess: () => setShowModal(false) })
    }

    // Delete supplier - may confirmation
    const destroy = (id, name) => {
        if (confirm(`Delete "${name}"?`)) {
            router.delete(`/suppliers/${id}`)
        }
    }

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
                    <button onClick={() => router.get('/products')} style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #2e2820',
                        background: 'transparent', color: '#7a6e60', cursor: 'pointer', fontSize: 13
                    }}>📦 Products</button>
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
                        <h1 style={{ color: '#f0e8d8', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>🤝 Suppliers</h1>
                        <p style={{ color: '#7a6e60', margin: 0, fontSize: 14 }}>{suppliers.length} suppliers</p>
                    </div>
                    <button onClick={openAdd} style={{
                        padding: '10px 20px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                    }}>＋ Add Supplier</button>
                </div>

                {/* ── SEARCH BAR ── */}
                <div style={{ marginBottom: 20 }}>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍  Search by name or contact..."
                        style={{ ...inp, maxWidth: 360, padding: '10px 16px' }}
                    />
                </div>

                {/* ── SUPPLIERS TABLE ── */}
                <div style={{ background: '#1a1612', border: '1px solid #2e2820', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                                {['Name', 'Contact', 'Email', 'Phone', 'City', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        color: '#7a6e60', fontSize: 11, textAlign: 'left', fontWeight: 500,
                                        padding: '12px 20px', borderBottom: '1px solid #2e2820',
                                        textTransform: 'uppercase', letterSpacing: '.06em'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(46,40,32,.5)' : 'none' }}>
                                    <td style={{ padding: '14px 20px', color: '#f0e8d8', fontWeight: 500, fontSize: 13 }}>{s.name}</td>
                                    <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{s.contact_person || '—'}</td>
                                    <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{s.email || '—'}</td>
                                    <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{s.phone || '—'}</td>
                                    <td style={{ padding: '14px 20px', color: '#7a6e60', fontSize: 13 }}>{s.city || '—'}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <button onClick={() => destroy(s.id, s.name)} style={{
                                            width: 30, height: 30, borderRadius: 7, border: '1px solid #2e2820',
                                            background: '#221e19', cursor: 'pointer', fontSize: 13
                                        }}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: 48, textAlign: 'center', color: '#7a6e60' }}>
                            No suppliers found.
                        </div>
                    )}
                </div>
            </div>

            {/* ── ADD SUPPLIER MODAL ── */}
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
                                ＋ Add Supplier
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{
                                background: '#221e19', border: '1px solid #2e2820',
                                borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#7a6e60', fontSize: 16
                            }}>✕</button>
                        </div>

                        {/* Form Fields */}
                        {[
                            { label: 'Supplier Name *', key: 'name', placeholder: 'e.g. ABC Trading' },
                            { label: 'Contact Person', key: 'contact_person', placeholder: 'John Doe' },
                            { label: 'Email', key: 'email', placeholder: 'contact@supplier.com', type: 'email' },
                            { label: 'Phone', key: 'phone', placeholder: '+63 9XX XXX XXXX' },
                            { label: 'Address', key: 'address', placeholder: 'Street address' },
                            { label: 'City', key: 'city', placeholder: 'City name' },
                            { label: 'Notes', key: 'notes', placeholder: 'Additional notes', type: 'textarea' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 14 }}>
                                <label style={{ color: '#7a6e60', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                {f.type === 'textarea' ? (
                                    <textarea
                                        value={form[f.key]}
                                        onChange={e => setForm({...form, [f.key]: e.target.value})}
                                        placeholder={f.placeholder}
                                        style={{...inp, minHeight: 80, verticalAlign: 'top'}}
                                    />
                                ) : (
                                    <input
                                        type={f.type ?? 'text'}
                                        value={form[f.key]}
                                        onChange={e => setForm({...form, [f.key]: e.target.value})}
                                        placeholder={f.placeholder}
                                        style={inp}
                                    />
                                )}
                            </div>
                        ))}

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
                            }}>✓ Save Supplier</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
