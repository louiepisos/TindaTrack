<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// ── ARTISAN CONSOLE COMMANDS ──
// Dito pwedeng mag-define ng custom console commands na pwedeng i-run via php artisan

// Default inspire command - displays inspiring quote
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
