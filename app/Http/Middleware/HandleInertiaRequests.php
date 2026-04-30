<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

// HandleInertiaRequests - Inertia.js middleware para sa server-side rendering
// Nag-handle ng communication between Laravel backend at React frontend
// Ginagamit ang Inertia para sa seamless page transitions

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template na ini-load sa first page visit.
     * Ito ay ang main HTML file na nag-mount ng React app
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines ang current asset version.
     * Ginagamit para sa cache busting - pag nag-update ng assets, mag-refresh ang clients
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define ang props na shared by default sa lahat ng pages.
     * Mga props dito ay automatically available sa lahat ng React components
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            // Pwedeng mag-add dito ng commonly used data
            // e.g., authenticated user, flash messages, etc.
        ];
    }
}
