#!/bin/sh

set -e

SCRIPT_DIR="$(dirname -- "$0")"
# shellcheck source=git-utils.sh
. "$SCRIPT_DIR/git-utils.sh"

is_git_repo

if ! git diff-index --quiet HEAD --; then
  echo "You have uncommitted changes"
  exit 1;
fi

if [ "$(git ls-files --other --directory --exclude-standard)" != '' ]; then
  echo "You have untracked files"
  exit 2;
fi
