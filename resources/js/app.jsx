// Import ang bootstrap configuration - nag-setup sa axios and HTTP headers
import './bootstrap'
// Import ang global CSS styles
import '../css/app.css'
// Import React root renderer
import { createRoot } from 'react-dom/client'
// Import Inertia.js React adapter para sa server-side rendering
import { createInertiaApp } from '@inertiajs/react'
// Import helper para mag-resolve ng page components dynamically
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

// Initialize ang Inertia.js app
// nag-create og single-page application na seamlessly integrated sa Laravel
createInertiaApp({
    // Customize ang browser title - mag-add sa app name
    title: (title) => `${title} — TindaTrack`,
    // Dynamically mag-load sa React page components
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,  // Load from Pages directory
            import.meta.glob('./Pages/**/*.jsx')  // Vite dynamic imports
        ),
    // Setup ang React mounting point
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
    // Configure ang progress bar na mag-show during page transitions
    progress: {
        color: '#e8a236',  // Brand color - golden orange
    },
})
