#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Try to start with docker compose, prefer docker compose v2 (plugin)
if command -v docker >/dev/null 2>&1; then
  echo "Found docker. Trying 'docker compose up --build'..."
  if docker compose up --build -d; then
    echo "Docker compose started. Visit: http://localhost:8080/"
    exit 0
  else
    echo "Failed to start with 'docker compose'. Trying 'docker-compose'..."
  fi
fi

if command -v docker-compose >/dev/null 2>&1; then
  echo "Found docker-compose. Trying 'docker-compose up --build'..."
  if docker-compose up --build -d; then
    echo "docker-compose started. Visit: http://localhost:8080/"
    exit 0
  else
    echo "Failed to start with docker-compose."
  fi
fi

# If Docker is unavailable or can't be run, fail with an explanatory message
echo "Docker not available or failed. Please install Docker or run via docker-compose."
exit 2
