<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// AppServiceProvider - nag-bootstrap ng application services
// Dito pwedeng mag-register ng service bindings, event listeners, etc.

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * Ang method na ito ay tina-call ng framework bago i-boot ang providers
     * Ginagamit para mag-register ng bindings sa container
     */
    public function register(): void
    {
        // Pwedeng mag-add ng service bindings dito
        // e.g., $this->app->singleton(Service::class, Implementation::class)
    }

    /**
     * Bootstrap any application services.
     * Ang method na ito ay tina-call pagkatapos ng lahat ng providers ay na-register
     * Ginagamit para mag-setup ng routes, listeners, etc.
     */
    public function boot(): void
    {
        // Pwedeng mag-add ng event listeners, route macros, etc. dito
    }
}
