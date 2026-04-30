<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <!-- Character encoding at viewport settings -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <!-- App title -->
    <title>TindaTrack</title>
    <!-- Vite React refresh support para sa hot module reload during development -->
    @viteReactRefresh
    <!-- Vite asset loader - nag-load ng JS at CSS assets -->
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    <!-- Inertia head - nag-inject ng meta tags at stuff from backend -->
    @inertiaHead
</head>
<body>
    <!-- Root element para sa React app - lahat ng React components ay mag-mount dito -->
    @inertia
</body>
</html>
