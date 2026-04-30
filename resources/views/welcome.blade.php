<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <!-- Character encoding - UTF-8 para sa international characters -->
    <meta charset="utf-8"/>
    <!-- Viewport settings - responsive design para sa mobile devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <!-- Vite React refresh - hot reload support during development -->
    @viteReactRefresh
    <!-- Load Vite assets - JavaScript at CSS files -->
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    <!-- Inertia.js head component - nag-manage ng document head -->
    @inertiaHead
</head>
<body>
    <!-- Root element where React app ay mag-render -->
    @inertia
</body>
</html>
