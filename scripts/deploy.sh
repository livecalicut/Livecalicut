#!/usr/bin/env bash
# Deploy LiveCalicut when origin/main changes.
# Runtime copy: /usr/local/bin/livecalicut-deploy
# Triggered by the systemd timer and by the GitHub Actions SSH key.
set -euo pipefail

export GIT_TERMINAL_PROMPT=0
export CI=true
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"

APP_DIR="/var/www/Livecalicut"
STATE_DIR="/var/lib/livecalicut"
ENV_BACKUP="$STATE_DIR/env"
SHA_FILE="$STATE_DIR/deployed-sha"
LOCK_FILE="/var/lock/livecalicut-deploy.lock"
BRANCH="main"
PM2_NAME="livecalicut"

mkdir -p "$STATE_DIR"
chmod 700 "$STATE_DIR"

exec 9>"$LOCK_FILE"
if ! flock -w 900 9; then
  echo "Deploy lock timed out"
  exit 1
fi

cd "$APP_DIR"

if [[ -f .env ]]; then
  cp .env "$ENV_BACKUP"
  chmod 600 "$ENV_BACKUP"
fi

echo "[$(date -Is)] fetching origin/${BRANCH}"
git fetch origin "$BRANCH"

TARGET="$(git rev-parse "origin/${BRANCH}")"
DEPLOYED="$(cat "$SHA_FILE" 2>/dev/null || true)"

if [[ "$TARGET" == "$DEPLOYED" ]]; then
  echo "[$(date -Is)] already deployed ${TARGET:0:7}"
  exit 0
fi

echo "[$(date -Is)] deploying ${DEPLOYED:-none} -> ${TARGET:0:7}"

dirty="$(git status --porcelain --untracked-files=all | grep -v -E '(^.. \.env$)' || true)"
if [[ -n "$dirty" ]]; then
  echo "[$(date -Is)] stashing local changes before reset"
  printf '%s\n' "$dirty"
  git stash push --include-untracked -m "pre-deploy $(date -Is) before ${TARGET:0:7}"
  echo "Recover stashed work with: git stash list"
fi

git reset --hard "$TARGET"

if [[ -f "$ENV_BACKUP" ]]; then
  cp "$ENV_BACKUP" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
fi

echo "[$(date -Is)] npm ci"
npm ci

echo "[$(date -Is)] next build"
npm run build

echo "[$(date -Is)] restarting pm2 ${PM2_NAME}"
if pm2 pid "$PM2_NAME" | grep -Eq '^[0-9]+$'; then
  pm2 restart "$PM2_NAME" --update-env
else
  pm2 start npm --name "$PM2_NAME" --cwd "$APP_DIR" -- start -- -H 127.0.0.1 -p 3000
fi
pm2 save

ready=0
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:3000/; then
    ready=1
    break
  fi
  sleep 2
done

if [[ "$ready" -ne 1 ]]; then
  echo "[$(date -Is)] app did not respond on 127.0.0.1:3000"
  exit 1
fi

echo "$TARGET" > "$SHA_FILE"
echo "[$(date -Is)] deployed ${TARGET:0:7}"

REPO_SCRIPT="$APP_DIR/scripts/deploy.sh"
SELF="/usr/local/bin/livecalicut-deploy"
if [[ -f "$REPO_SCRIPT" && "$0" == "$SELF" ]] && ! cmp -s "$REPO_SCRIPT" "$SELF"; then
  cp "$REPO_SCRIPT" "${SELF}.new"
  mv "${SELF}.new" "$SELF"
  chmod 755 "$SELF"
fi
