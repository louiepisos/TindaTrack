<?php

// Service providers configuration
// Dito nag-list ng lahat ng service providers na kailangan ng app

use App\Providers\AppServiceProvider;

return [
    // Mag-load ang AppServiceProvider - nag-register ng app services
    AppServiceProvider::class,
];
