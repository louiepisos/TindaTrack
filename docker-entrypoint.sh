#!/bin/bash

echo "🏪 Starting TindaTrack..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for database..."
sleep 5

if [ ! -f .env ]; then
    echo "[TindaTrack] Creating .env from .env.example"
    cp .env.example .env
fi

# Generate app key if not set
if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --no-interaction --force
fi

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --no-interaction --force

# Run seeders (only if database is empty)
echo "🌱 Seeding database..."
php artisan db:seed --no-interaction --force

# Clear and cache config
echo "⚙️ Optimizing..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "✅ TindaTrack is ready! Visit http://localhost:8000"

# Start Apache
exec "$@"
