import { useState } from 'react'
import { router } from '@inertiajs/react'

// LoginPage Component - ang login form para sa user authentication
// Naga-display sa login form og nag-handle sa login submission
export default function Login() {
    // Form state - naga-store sa email, password, og remember preference
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    // Validation errors - naga-store sa error messages gikan sa server
    const [errors, setErrors] = useState({})
    // Loading state - true hangtud naga-process ang login
    const [loading, setLoading] = useState(false)

    // Handle input change - update ang form state hantud naga-type ang user
    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    // Handle form submission - mag-send og login request sa backend
    const submit = () => {
        setLoading(true)
        // Mag-POST sa /login endpoint with credentials
        router.post('/login', form, {
            // Kung naay error sa authentication, mag-set og errors
            onError: (e) => { setErrors(e); setLoading(false) },
            // homan sa request (success o error), stop loading
            onFinish: () => setLoading(false),
        })
    }

    // Render ang login page with dark theme design
    return (
        <div style={{
            minHeight: '100vh', background: '#0f0d0a',  // Dark background
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

                {/* Logo Section */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    {/* Logo box with gradient */}
                    <div style={{
                        width: 64, height: 64, borderRadius: 18,
                        background: 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 28, marginBottom: 16
                    }}>🏪</div>
                    {/* App title */}
                    <h1 style={{
                        fontSize: 32, fontWeight: 800, margin: 0,
                        background: 'linear-gradient(135deg, #e8a236, #f0c060)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>TindaTrack</h1>
                    {/* Subtitle */}
                    <p style={{ color: '#7a6e60', margin: '6px 0 0', fontSize: 14 }}>
                        Inventory Management System
                    </p>
                </div>

                {/* Login Card */}
                <div style={{
                    background: '#1a1612', border: '1px solid #2e2820',
                    borderRadius: 20, padding: 32
                }}>
                    {/* Card heading */}
                    <h2 style={{ color: '#f0e8d8', fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>
                        Welcome back 👋
                    </h2>

                    {/* Email Input Field */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ color: '#7a6e60', fontSize: 13, display: 'block', marginBottom: 6 }}>
                            Email Address
                        </label>
                        <input
                            name="email" type="email" value={form.email} onChange={handle}
                            placeholder="Enter your Email"
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: 10,
                                background: '#221e19', border: `1px solid ${errors.email ? '#d9534f' : '#2e2820'}`,
                                color: '#f0e8d8', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                            }}
                        />
                        {/* Show email error kung naay error */}
                        {errors.email && <p style={{ color: '#d9534f', fontSize: 12, margin: '4px 0 0' }}>{errors.email}</p>}
                    </div>

                    {/* Password Input Field */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ color: '#7a6e60', fontSize: 13, display: 'block', marginBottom: 6 }}>
                            Password
                        </label>
                        <input
                            name="password" type="password" value={form.password} onChange={handle}
                            placeholder="Enter your Password"
                            onKeyDown={(e) => e.key === 'Enter' && submit()}  // Submit on Enter key
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: 10,
                                background: '#221e19', border: `1px solid ${errors.password ? '#d9534f' : '#2e2820'}`,
                                color: '#f0e8d8', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                            }}
                        />
                        {/* Show password error kung naay error */}
                        {errors.password && <p style={{ color: '#d9534f', fontSize: 12, margin: '4px 0 0' }}>{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button onClick={submit} disabled={loading} style={{
                        width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                        background: loading ? '#3a3228' : 'linear-gradient(135deg, #e8a236, #c45c2a)',
                        color: loading ? '#7a6e60' : '#fff', fontSize: 15, fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
                    }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Demo Credentials Hint */}
                    <div style={{
                        marginTop: 20, padding: 14, background: '#221e19',
                        borderRadius: 10, border: '1px solid #2e2820'
                    }}>
                        <p style={{ color: '#7a6e60', fontSize: 12, margin: 0, textAlign: 'center' }}>
                            Demo: <span style={{ color: '#e8a236' }}>admin@tindatrack.ph</span> / <span style={{ color: '#e8a236' }}>password</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p style={{ color: '#3a3228', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
                    TindaTrack © 2025 — Filipino Store Inventory
                </p>
            </div>
        </div>
    )
}
