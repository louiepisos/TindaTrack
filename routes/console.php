<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// ── ARTISAN CONSOLE COMMANDS ──
// Dari pwede mag-define og custom console commands na pwede i-run via php artisan

// Default inspire command - displays inspiring quote
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
