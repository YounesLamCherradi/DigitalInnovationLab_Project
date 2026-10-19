#!/bin/sh
set -eu

if [ -f /seed/database.dump ]; then
  echo "Restoring PostgreSQL backup from /seed/database.dump"
  pg_restore \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --no-owner \
    --no-privileges \
    --exit-on-error \
    /seed/database.dump
else
  echo "No database backup found; initializing an empty database"
  psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file /docker-init/postgres_schema.sql
fi
