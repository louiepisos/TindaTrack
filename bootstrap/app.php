<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Application bootstrap configuration
// Dari nag-configure sa routing, middleware, exception handling

return Application::configure(basePath: dirname(__DIR__))
    // Configure ang routing - kung asa ang web routes og console commands
    ->withRouting(
        web: __DIR__.'/../routes/web.php',      // Web routes para sa HTTP requests
        commands: __DIR__.'/../routes/console.php', // Console/CLI commands
        health: '/up',                           // Health check endpoint
    )
    // Configure ang middleware - request/response processing
    ->withMiddleware(function (Middleware $middleware) {
        // Mag-append og Inertia middleware sa web middleware group
        //  nag-enable sa Inertia.js functionality
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    // Configure exception handling
    ->withExceptions(function (Exceptions $exceptions) {
        // Pwede mag-add og custom exception handling dito
    })->create();
