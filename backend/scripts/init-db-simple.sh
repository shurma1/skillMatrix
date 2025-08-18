#!/bin/sh

echo "Waiting for database to be ready..."

# Simple wait for PostgreSQL without pg_isready
sleep 10

echo "Database should be ready!"

echo "Creating permissions..."
npm run create:permissions || echo "Permissions creation failed or already exist"

echo "Creating admin user..."
npm run create:admin || echo "Admin creation failed or already exist"

echo "Starting application..."
exec node dist/index.js
