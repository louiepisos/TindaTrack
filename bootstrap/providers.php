<?php

// Service providers configuration
// Dari naga list sa tanan nga service providers na kinahanglan sa app

use App\Providers\AppServiceProvider;

return [
    // Mag-load ang AppServiceProvider - nag-register sa app services
    AppServiceProvider::class,
];
