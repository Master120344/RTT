#!/usr/bin/env bash
# Copy only this edition's presentation files. Keep production config and checkout untouched.
set -euo pipefail

source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
website_dir="$HOME/redeemingthetimetoday.com"
backup_dir="$HOME/website-backups"
files=(
  index_desktop.html index_desktop.js index_mobile.html index_mobile.js
  mission_mobile.html programs_mobile.html team_mobile.html
  shop_desktop.html shop_mobile.html
  october.css october-calendar.js october.js october-art.svg
)

if [[ ! -d "$website_dir" || ! -f "$website_dir/index.html" ]]; then
  printf '%s\n' 'Website folder was not found. Nothing was copied.' >&2
  exit 1
fi
if [[ "$source_dir" == "$(cd "$website_dir" && pwd)" ]]; then
  printf '%s\n' 'Run this from the separate RTT checkout, outside the live website.' >&2
  exit 1
fi
for file in "${files[@]}"; do
  if [[ ! -f "$source_dir/$file" ]]; then
    printf 'Required source file is missing: %s\n' "$file" >&2
    exit 1
  fi
done

umask 077
mkdir -p "$backup_dir"
backup_file="$(mktemp "$backup_dir/pre-october-$(date +%Y%m%d-%H%M%S)-XXXXXX.tar.gz")"
tar -C "$website_dir" -czf "$backup_file" .
printf 'Backup saved: %s\n' "$backup_file"

for file in "${files[@]}"; do
  staged_file="$(mktemp "$website_dir/.october-stage-XXXXXX")"
  cp -- "$source_dir/$file" "$staged_file"
  chmod 644 "$staged_file"
  mv -f -- "$staged_file" "$website_dir/$file"
done
printf '%s\n' 'October edition deployed: 13 presentation files updated.'
