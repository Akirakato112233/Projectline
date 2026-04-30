#!/usr/bin/env bash
set -e

BASE_URL="https://astroflow.a-zens.com"
COOKIE_JAR=/tmp/projectline_cookies.txt

echo "Login..."
curl -sS -c "$COOKIE_JAR" \
  -H 'Content-Type: application/json' \
  -X POST "$BASE_URL/api/auth/login/" \
  --data '{"password":"123"}' > /dev/null

SESSION_COOKIE=$(awk '/sessionid/ {print $6 "=" $7}' "$COOKIE_JAR")
echo "Session: $SESSION_COOKIE"

echo
echo "Dashboard overview"
ab -k -n 100 -c 10 -C "$SESSION_COOKIE" \
  "$BASE_URL/api/dashboard/overview/"

echo
echo "Tarot overview"
ab -k -n 100 -c 10 -C "$SESSION_COOKIE" \
  "$BASE_URL/api/tarot/overview/"

echo
echo "Astrology overview"
ab -k -n 100 -c 10 -C "$SESSION_COOKIE" \
  "$BASE_URL/api/astrology/overview/"
