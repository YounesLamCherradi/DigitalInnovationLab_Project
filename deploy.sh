#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$ROOT_DIR"

usage() {
  echo "Usage: ./deploy.sh [--restore /path/to/backup/TIMESTAMP]"
  echo ""
  echo "Without --restore, a new empty database is initialized."
  echo "With --restore, database.dump and media.tar.gz are imported on first boot."
}

RESTORE_DIR=""
STAGED_SEED=""

cleanup() {
  if [ -n "$STAGED_SEED" ] && [ -d "$STAGED_SEED" ]; then
    rm -rf -- "$STAGED_SEED"
  fi
}
trap cleanup EXIT INT TERM

if [ "${1:-}" = "--restore" ]; then
  RESTORE_DIR=${2:-}
  if [ -z "$RESTORE_DIR" ]; then
    usage >&2
    exit 1
  fi
  REQUESTED_RESTORE_DIR=$RESTORE_DIR
  RESTORE_DIR=$(CDPATH= cd -- "$REQUESTED_RESTORE_DIR" 2>/dev/null && pwd) || {
    echo "Backup directory does not exist: $REQUESTED_RESTORE_DIR" >&2
    exit 1
  }
  if [ ! -f "$RESTORE_DIR/database.dump" ]; then
    echo "Missing $RESTORE_DIR/database.dump" >&2
    exit 1
  fi
elif [ "$#" -ne 0 ]; then
  usage >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required: https://docs.docker.com/engine/install/" >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required." >&2
  exit 1
fi

if [ ! -f .env ]; then
  if command -v openssl >/dev/null 2>&1; then
    POSTGRES_PASSWORD=$(openssl rand -hex 24)
    SESSION_SECRET=$(openssl rand -hex 32)
  else
    POSTGRES_PASSWORD=$(docker run --rm alpine:3.22 sh -c 'head -c 24 /dev/urandom | od -An -tx1 | tr -d " \n"')
    SESSION_SECRET=$(docker run --rm alpine:3.22 sh -c 'head -c 32 /dev/urandom | od -An -tx1 | tr -d " \n"')
  fi
  sed \
    -e "s|__POSTGRES_PASSWORD__|$POSTGRES_PASSWORD|g" \
    -e "s|__SESSION_SECRET__|$SESSION_SECRET|g" \
    .env.docker.example > .env
  chmod 600 .env
  echo "Created .env with generated secrets. Edit SITE_URL and email settings when needed."
fi

if [ -n "$RESTORE_DIR" ]; then
  PROJECT_NAME=$(sed -n 's/^COMPOSE_PROJECT_NAME=//p' .env | tail -n 1)
  PROJECT_NAME=${PROJECT_NAME:-digital-innovation-lab}
  if docker volume inspect "${PROJECT_NAME}_postgres_data" >/dev/null 2>&1; then
    echo "Refusing to restore over an existing database volume: ${PROJECT_NAME}_postgres_data" >&2
    echo "Use ./scripts/restore.sh for an intentional restore, or deploy on a clean server." >&2
    exit 1
  fi
  STAGED_SEED=$(mktemp -d /tmp/dil-seed.XXXXXX)
  cp "$RESTORE_DIR/database.dump" "$STAGED_SEED/database.dump"
  if [ -f "$RESTORE_DIR/media.tar.gz" ]; then
    cp "$RESTORE_DIR/media.tar.gz" "$STAGED_SEED/media.tar.gz"
  fi
  chmod 755 "$STAGED_SEED"
  chmod 644 "$STAGED_SEED"/*
  export SEED_DIR="$STAGED_SEED"
  export RESTORE_MEDIA=true
fi

docker compose up --detach --build --wait

APP_PORT=$(sed -n 's/^APP_PORT=//p' .env | tail -n 1)
APP_PORT=${APP_PORT:-3000}
echo "Digital Innovation Lab is running at http://localhost:$APP_PORT"
echo "Status: docker compose ps"
echo "Logs:   docker compose logs -f app"
