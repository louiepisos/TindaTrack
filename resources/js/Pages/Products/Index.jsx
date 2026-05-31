// Product management page - organized, searchable, and responsive inventory UI
import { useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Products() {
    const { products, categories, suppliers } = usePage().props
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [stockFilter, setStockFilter] = useState('all')
    const [form, setForm] = useState({
        name: '', sku: '', emoji: '📦',
        category_id: '', supplier_id: '',
        cost_price: '', unit_price: '',
        tingi_price: '', pieces_per_pack: 1,
        stock_quantity: '', restock_threshold: 10,
        unit: 'pcs', selling_mode: 'tingi'
    })

    const emojis = ['📦','🧃','☕','🍫','🍜','🥛','🧴','🥫','🧂','🍬','🍪','🧻','🪥','🧼','🫙','🐟','🍵','🍟']

    const categoryOptions = useMemo(() => {
        const counts = products.reduce((acc, product) => {
            const key = product.category_id ? String(product.category_id) : 'uncategorized'
            acc[key] = (acc[key] || 0) + 1
            return acc
        }, {})

        return [
            { id: 'all', name: 'All Products', emoji: '🗂️', count: products.length },
            ...categories.map(category => ({
                id: String(category.id),
                name: category.name,
                emoji: category.emoji || '📁',
                count: counts[String(category.id)] || 0,
            })),
            { id: 'uncategorized', name: 'Uncategorized', emoji: '📦', count: counts.uncategorized || 0 },
        ]
    }, [categories, products])

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()

        return products.filter(product => {
            const categoryKey = product.category_id ? String(product.category_id) : 'uncategorized'
            const matchesCategory = selectedCategory === 'all' || selectedCategory === categoryKey
            const matchesStock = stockFilter === 'all' || product.status === stockFilter
            const matchesSearch = !term || [
                product.name,
                product.sku,
                product.category,
            ].some(value => (value || '').toLowerCase().includes(term))

            return matchesCategory && matchesStock && matchesSearch
        })
    }, [products, search, selectedCategory, stockFilter])

    const groupedProducts = useMemo(() => {
        const groups = filtered.reduce((acc, product) => {
            const key = product.category_id ? String(product.category_id) : 'uncategorized'
            const category = categoryOptions.find(option => option.id === key)
            const fallbackName = product.category || 'Uncategorized'

            if (!acc[key]) {
                acc[key] = {
                    id: key,
                    name: category?.name || fallbackName,
                    emoji: category?.emoji || '📦',
                    products: [],
                }
            }

            acc[key].products.push(product)
            return acc
        }, {})

        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
    }, [categoryOptions, filtered])

    const stockSummary = useMemo(() => ({
        all: products.length,
        critical: products.filter(product => product.status === 'critical').length,
        low: products.filter(product => product.status === 'low').length,
    }), [products])

    const resetFilters = () => {
        setSearch('')
        setSelectedCategory('all')
        setStockFilter('all')
    }

    const openAdd = () => {
        setEditing(null)
        setForm({
            name: '', sku: '', emoji: '📦', category_id: '', supplier_id: '',
            cost_price: '', unit_price: '', tingi_price: '',
            pieces_per_pack: 1, stock_quantity: '',
            restock_threshold: 10, unit: 'pcs', selling_mode: 'tingi'
        })
        setShowModal(true)
    }

    const openEdit = (product) => {
        setEditing(product.id)
        const mode = product.unit_price && product.tingi_price ? 'both'
            : product.tingi_price ? 'tingi' : 'pack'

        setForm({
            name: product.name,
            sku: product.sku ?? '',
            emoji: product.emoji,
            category_id: product.category_id ?? '',
            supplier_id: product.supplier_id ?? '',
            cost_price: product.cost_price ?? '',
            unit_price: product.unit_price ?? '',
            tingi_price: product.tingi_price ?? '',
            pieces_per_pack: product.pieces_per_pack ?? 1,
            stock_quantity: product.stock,
            restock_threshold: product.threshold,
            unit: product.unit,
            selling_mode: mode
        })
        setShowModal(true)
    }

    const save = () => {
        const data = { ...form }
        if (data.selling_mode === 'tingi') {
            data.unit_price = data.tingi_price
            data.pieces_per_pack = 1
        } else if (data.selling_mode === 'pack') {
            data.tingi_price = null
            data.pieces_per_pack = 1
        }

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

    const destroy = (id, name) => {
        if (confirm(`Delete "${name}"?`)) router.delete(`/products/${id}`)
    }

    const statusStyle = (status) => {
        if (status === 'critical') return { bg: '#3d1a1a', color: '#d9534f', label: 'Critical' }
        if (status === 'low') return { bg: '#3d2e0a', color: '#e8a236', label: 'Low Stock' }
        return { bg: '#1a3d2a', color: '#5aad7f', label: 'In Stock' }
    }

    const productMode = (product) => {
        const hasTingi = product.tingi_price && parseFloat(product.tingi_price) > 0
        const hasPack = product.unit_price && parseFloat(product.unit_price) > 0
        return {
            hasTingi,
            hasPack,
            mode: hasTingi && hasPack ? 'both' : hasTingi ? 'tingi' : 'pack',
        }
    }

    const inputClass = 'product-input'

    const label = (text, hint = '') => (
        <div className="product-field-label-row">
            <label className="product-field-label">{text}</label>
            {hint && <span className="product-field-hint">{hint}</span>}
        </div>
    )

    const sellingModes = [
        { value: 'tingi', label: '🍬 By Piece (Tingi)', desc: 'Sell per piece only (e.g. candy, matches)' },
        { value: 'pack',  label: '📦 By Pack only',    desc: 'Sell as whole pack only (e.g. noodles, soap)' },
        { value: 'both',  label: '🔀 Both',            desc: 'Can sell by piece or by pack (e.g. Milo sachet)' },
    ]

    const renderPrice = (product) => {
        const mode = productMode(product)

        return (
            <div className="product-price-stack">
                {mode.hasPack && (
                    <div className="product-pack-price">₱{parseFloat(product.unit_price).toFixed(2)} <span>/ pack</span></div>
                )}
                {mode.hasTingi && (
                    <div className="product-tingi-price">₱{parseFloat(product.tingi_price).toFixed(2)} <span>/ pc</span></div>
                )}
            </div>
        )
    }

    const renderModeBadge = (product) => {
        const { mode } = productMode(product)
        return (
            <span className={`product-mode-badge product-mode-badge--${mode}`}>
                {mode === 'both' ? '🔀 Both' : mode === 'tingi' ? '🍬 Tingi' : '📦 Pack'}
            </span>
        )
    }

    const renderActions = (product) => (
        <div className="product-row-actions">
            <button type="button" onClick={() => openEdit(product)} className="product-icon-button" aria-label={`Edit ${product.name}`}>✏️</button>
            <button type="button" onClick={() => destroy(product.id, product.name)} className="product-icon-button" aria-label={`Delete ${product.name}`}>🗑️</button>
        </div>
    )

    return (
        <div className="products-page">
            <header className="products-topbar">
                <div className="products-brand">
                    <span className="products-brand-icon">🏪</span>
                    <span className="products-brand-name">TindaTrack</span>
                </div>
                <nav className="products-nav" aria-label="Primary navigation">
                    <button type="button" onClick={() => router.get('/dashboard')}>📊 <span>Dashboard</span></button>
                    <button type="button" onClick={() => router.get('/utang')}>📋 <span>Utang</span></button>
                    <button type="button" onClick={() => router.get('/sales')}>🧾 <span>Sales</span></button>
                    <button type="button" onClick={() => router.post('/logout')}>↩ <span>Logout</span></button>
                </nav>
            </header>

            <main className="products-main">
                <section className="products-hero">
                    <div>
                        <p className="products-eyebrow">Inventory Management</p>
                        <h1>📦 Products</h1>
                        <p>{products.length} products in catalog · {categories.length} active categories</p>
                    </div>
                    <button type="button" onClick={openAdd} className="product-primary-button">＋ Add Product</button>
                </section>

                <section className="products-toolbar" aria-label="Product search and filters">
                    <div className="products-search-wrap">
                        <label htmlFor="product-search">Search products</label>
                        <input
                            id="product-search"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Search by name, SKU/barcode, or category..."
                            className={inputClass}
                        />
                    </div>

                    <div className="products-filter-grid">
                        <div>
                            <label htmlFor="category-filter">Category</label>
                            <select id="category-filter" value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)} className={inputClass}>
                                {categoryOptions.map(category => (
                                    <option key={category.id} value={category.id}>{category.emoji} {category.name} ({category.count})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="stock-filter">Stock Status</label>
                            <select id="stock-filter" value={stockFilter} onChange={event => setStockFilter(event.target.value)} className={inputClass}>
                                <option value="all">All stock ({stockSummary.all})</option>
                                <option value="critical">Critical ({stockSummary.critical})</option>
                                <option value="low">Low stock ({stockSummary.low})</option>
                            </select>
                        </div>
                    </div>

                    <button type="button" onClick={resetFilters} className="product-secondary-button">Reset</button>
                </section>

                <section className="products-category-tabs" aria-label="Quick category filters">
                    {categoryOptions.map(category => (
                        <button
                            key={category.id}
                            type="button"
                            className={selectedCategory === category.id ? 'active' : ''}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span>{category.emoji}</span>
                            <strong>{category.name}</strong>
                            <em>{category.count}</em>
                        </button>
                    ))}
                </section>

                <section className="products-results-card">
                    <div className="products-results-header">
                        <div>
                            <h2>Product Catalog</h2>
                            <p>{filtered.length} matching products grouped by category</p>
                        </div>
                        <div className="products-results-meta">Scrollable inventory list</div>
                    </div>

                    <div className="products-scroll-area">
                        {groupedProducts.map(group => (
                            <div className="products-category-group" key={group.id}>
                                <div className="products-group-header">
                                    <div>
                                        <span>{group.emoji}</span>
                                        <strong>{group.name}</strong>
                                    </div>
                                    <em>{group.products.length} items</em>
                                </div>

                                <div className="products-table-wrap">
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                {['Product', 'SKU/Barcode', 'Selling Mode', 'Price', 'Stock', 'Status', 'Actions'].map(header => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.products.map(product => {
                                                const stockStatus = statusStyle(product.status)
                                                return (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <div className="product-name-cell">
                                                                <div className="product-emoji">{product.emoji}</div>
                                                                <div>
                                                                    <strong>{product.name}</strong>
                                                                    <span>{product.category ?? 'Uncategorized'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="product-muted-cell">{product.sku || '—'}</td>
                                                        <td>{renderModeBadge(product)}</td>
                                                        <td>{renderPrice(product)}</td>
                                                        <td className="product-stock-cell">{product.stock} {product.unit}</td>
                                                        <td><span className="product-status-pill" style={{ background: stockStatus.bg, color: stockStatus.color }}>{stockStatus.label}</span></td>
                                                        <td>{renderActions(product)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="products-mobile-list">
                                    {group.products.map(product => {
                                        const stockStatus = statusStyle(product.status)
                                        return (
                                            <article className="product-mobile-card" key={product.id}>
                                                <div className="product-mobile-card-header">
                                                    <div className="product-name-cell">
                                                        <div className="product-emoji">{product.emoji}</div>
                                                        <div>
                                                            <strong>{product.name}</strong>
                                                            <span>{product.sku || 'No SKU'} · {product.category ?? 'Uncategorized'}</span>
                                                        </div>
                                                    </div>
                                                    {renderActions(product)}
                                                </div>
                                                <div className="product-mobile-details">
                                                    <div><span>Mode</span>{renderModeBadge(product)}</div>
                                                    <div><span>Price</span>{renderPrice(product)}</div>
                                                    <div><span>Stock</span><strong>{product.stock} {product.unit}</strong></div>
                                                    <div><span>Status</span><span className="product-status-pill" style={{ background: stockStatus.bg, color: stockStatus.color }}>{stockStatus.label}</span></div>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="products-empty-state">
                                <div>🔍</div>
                                <h3>No products found</h3>
                                <p>Try another product name, SKU/barcode, category, or stock filter.</p>
                                <button type="button" onClick={resetFilters} className="product-secondary-button">Clear filters</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {showModal && (
                <div className="product-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
                    <div className="product-modal-card">
                        <div className="product-modal-header">
                            <h3 id="product-modal-title">{editing ? '✏️ Edit Product' : '＋ Add Product'}</h3>
                            <button type="button" onClick={() => setShowModal(false)} aria-label="Close product modal">✕</button>
                        </div>

                        <div className="product-form-section">
                            {label('Icon')}
                            <div className="product-emoji-grid">
                                {emojis.map(emoji => (
                                    <button key={emoji} type="button" onClick={() => setForm({...form, emoji})} className={form.emoji === emoji ? 'active' : ''}>{emoji}</button>
                                ))}
                            </div>
                        </div>

                        <div className="product-form-grid">
                            <div className="product-form-section">
                                {label('Product Name *')}
                                <input type="text" value={form.name} onChange={event => setForm({...form, name: event.target.value})} placeholder="e.g. Maxx Candy" className={inputClass} />
                            </div>
                            <div className="product-form-section">
                                {label('SKU / Barcode')}
                                <input type="text" value={form.sku} onChange={event => setForm({...form, sku: event.target.value})} placeholder="Scan or enter barcode" className={inputClass} />
                            </div>
                        </div>

                        <div className="product-form-section product-selling-mode-section">
                            {label('Selling Mode *', 'How do you sell this product?')}
                            <div className="product-selling-modes">
                                {sellingModes.map(mode => (
                                    <button key={mode.value} type="button" onClick={() => setForm({...form, selling_mode: mode.value})} className={form.selling_mode === mode.value ? 'active' : ''}>
                                        <span>{mode.label}</span>
                                        <small>{mode.desc}</small>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="product-form-grid">
                            <div className="product-form-section">
                                {label('Cost Price (₱) *', 'How much you paid for this batch')}
                                <input type="number" min="0" step="0.01" value={form.cost_price} onChange={event => setForm({...form, cost_price: event.target.value})} placeholder="0.00" className={inputClass} />
                            </div>

                            {(form.selling_mode === 'pack' || form.selling_mode === 'both') && (
                                <div className="product-form-section">
                                    {label('Pack Price (₱) *', 'Selling price for whole pack')}
                                    <input type="number" min="0" step="0.01" value={form.unit_price} onChange={event => setForm({...form, unit_price: event.target.value})} placeholder="0.00" className={inputClass} />
                                </div>
                            )}

                            {(form.selling_mode === 'tingi' || form.selling_mode === 'both') && (
                                <div className="product-form-section">
                                    {label('Tingi Price (₱) *', 'Selling price per piece')}
                                    <input type="number" min="0" step="0.01" value={form.tingi_price} onChange={event => setForm({...form, tingi_price: event.target.value})} placeholder="0.00" className={inputClass} />
                                </div>
                            )}

                            {form.selling_mode === 'both' && (
                                <div className="product-form-section">
                                    {label('Pieces per Pack', 'How many pieces in one pack')}
                                    <input type="number" min="1" value={form.pieces_per_pack} onChange={event => setForm({...form, pieces_per_pack: event.target.value})} placeholder="1" className={inputClass} />
                                </div>
                            )}

                            <div className="product-form-section">
                                {label('Stock Quantity *')}
                                <input type="number" min="0" value={form.stock_quantity} onChange={event => setForm({...form, stock_quantity: event.target.value})} placeholder="0" className={inputClass} />
                            </div>

                            <div className="product-form-section">
                                {label('Restock Threshold')}
                                <input type="number" min="0" value={form.restock_threshold} onChange={event => setForm({...form, restock_threshold: event.target.value})} placeholder="10" className={inputClass} />
                            </div>

                            <div className="product-form-section">
                                {label('Unit')}
                                <input type="text" value={form.unit} onChange={event => setForm({...form, unit: event.target.value})} placeholder="pcs, sachet, box..." className={inputClass} />
                            </div>

                            <div className="product-form-section">
                                {label('Category')}
                                <select value={form.category_id} onChange={event => setForm({...form, category_id: event.target.value})} className={inputClass}>
                                    <option value="">Select category...</option>
                                    {categories.map(category => <option key={category.id} value={category.id}>{category.emoji} {category.name}</option>)}
                                </select>
                            </div>

                            <div className="product-form-section">
                                {label('Supplier')}
                                <select value={form.supplier_id} onChange={event => setForm({...form, supplier_id: event.target.value})} className={inputClass}>
                                    <option value="">Select supplier...</option>
                                    {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {form.cost_price > 0 && (
                            <div className="product-price-helper">
                                <div className="product-price-helper-title">💡 Price Suggestion Tool</div>
                                <label>Markup % — {form.markup ?? 30}%</label>
                                <input type="range" min="5" max="200" step="5" value={form.markup ?? 30} onChange={event => setForm({...form, markup: parseInt(event.target.value)})} />

                                <div className="product-price-suggestions">
                                    {(form.selling_mode === 'pack' || form.selling_mode === 'both') && (
                                        <div>
                                            <span>Suggested Pack Price:</span>
                                            <strong>₱{(parseFloat(form.cost_price || 0) * (1 + (form.markup ?? 30) / 100)).toFixed(2)}</strong>
                                            <button type="button" onClick={() => setForm({ ...form, unit_price: (parseFloat(form.cost_price || 0) * (1 + (form.markup ?? 30) / 100)).toFixed(2) })}>Apply</button>
                                        </div>
                                    )}

                                    {(form.selling_mode === 'tingi' || form.selling_mode === 'both') && form.stock_quantity > 0 && (
                                        <div>
                                            <span>Suggested Tingi Price:</span>
                                            <strong>₱{(parseFloat(form.cost_price || 0) / parseFloat(form.stock_quantity || 1) * (1 + (form.markup ?? 30) / 100)).toFixed(2)}</strong>
                                            <button type="button" onClick={() => setForm({ ...form, tingi_price: (parseFloat(form.cost_price || 0) / parseFloat(form.stock_quantity || 1) * (1 + (form.markup ?? 30) / 100)).toFixed(2) })}>Apply</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="product-modal-actions">
                            <button type="button" onClick={() => setShowModal(false)} className="product-secondary-button">Cancel</button>
                            <button type="button" onClick={save} className="product-primary-button">💾 Save Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
