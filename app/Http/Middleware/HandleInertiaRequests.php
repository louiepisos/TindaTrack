<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function handle(Request $request, \Closure $next): \Symfony\Component\HttpFoundation\Response
    {
        // Force HTTPS for ngrok
        if ($request->header('x-forwarded-proto') === 'https') {
            \URL::forceScheme('https');
        }

        return parent::handle($request, $next);
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}