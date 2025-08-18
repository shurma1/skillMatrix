#!/bin/sh

echo "Waiting for database to be ready..."

# Wait for PostgreSQL to be ready
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "Database is ready!"

echo "Creating permissions..."
npm run create:permissions || echo "Permissions creation failed or already exist"

echo "Creating admin user..."
npm run create:admin || echo "Admin creation failed or already exist"

echo "Starting application..."
exec node dist/index.js
