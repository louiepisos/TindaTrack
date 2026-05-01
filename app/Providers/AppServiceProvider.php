<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// AppServiceProvider - nag-bootstrap sa application services
//  pwede mag-register sa service bindings, event listeners, etc.

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * kani nga method kay gina call sa framework bag o i-boot ang providers
     * gamit para mag-register ang bindings sa container
     */
    public function register(): void
    {
        // Pwede mag-add og service bindings dito
        // e.g., $this->app->singleton(Service::class, Implementation::class)
    }

    /**
     * Bootstrap any application services.
     * This method kay gina call after sa tanan nga providers kay na register
     * Ginagamit para mag-setup sa routes, listeners, etc.
     */
    public function boot(): void
    {
        // Pwede mag add og event listeners, route macros, etc. dito
    }
}
