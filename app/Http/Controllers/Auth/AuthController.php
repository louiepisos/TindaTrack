<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// AuthController - nag-handle sa login og logout operations
// Ang responsibilities:
// 1. Ipakita ang login form
// 2. Validate og mag-authenticate sa credentials
// 3. Mag-logout og i-clear ang session

class AuthController extends Controller
{
    // Ipakita ang login page sa user
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    // Handle ang login form submission
    // Nag-verify sa email og password, then nag-create og session kung valid
    public function login(Request $request)
    {
        // Validate ang credentials - email og password kay required fields
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // tryan ang Auth::attempt - kung successful, mag-create sa session
        // Ang 'remember' flag kay nag-extend sa session duration
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            // Regenerate ang session ID para sa security (prevent session fixation)
            $request->session()->regenerate();
            // Mag-redirect sa dashboard or intended page
            return redirect()->intended(route('dashboard'));
        }

        // Kung login failed, mag-return with error message
        return back()->withErrors([
            'email' => 'These credentials do not match our records.',
        ])->onlyInput('email');
    }

    // Logout ang user - mag-clear sa tanan nga session data
    public function logout(Request $request)
    {
        // Mag-logout sa user from auth facade
        Auth::logout();
        // Invalidate ang current session
        $request->session()->invalidate();
        // Regenerate session token para sa security
        $request->session()->regenerateToken();
        // Redirect balik sa login page
        return redirect()->route('login');
    }
}
