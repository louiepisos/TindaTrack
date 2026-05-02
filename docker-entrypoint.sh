#!/bin/bash

echo "🏪 Starting TindaTrack..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for database..."
sleep 5

# Generate app key if not set
php artisan key:generate --no-interaction --force

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
