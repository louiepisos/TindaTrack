// Import ang bootstrap configuration - nag-setup ng axios at HTTP headers
import './bootstrap'
// Import ang global CSS styles
import '../css/app.css'
// Import React root renderer
import { createRoot } from 'react-dom/client'
// Import Inertia.js React adapter
import { createInertiaApp } from '@inertiajs/react'
// Import helper para mag-resolve ng page components
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

// Initialize ang Inertia app - nag-create ng SPA with Laravel backend
createInertiaApp({
    // Title modifier - add "— TindaTrack" sa browser title
    title: (title) => `${title} — TindaTrack`,
    // Resolve ang page components - kunin ang React component based on route
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,  // Component location sa Pages folder
            import.meta.glob('./Pages/**/*.jsx')  // Vite glob import
        ),
    // Setup ang Inertia app - mount React sa root element
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
    // Progress bar config - mag-show ng loading indicator sa page transitions
    progress: {
        color: '#e8a236',  // TindaTrack brand color
    },
})
