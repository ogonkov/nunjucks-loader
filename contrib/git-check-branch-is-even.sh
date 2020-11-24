#!/bin/sh

set -e

SCRIPT_DIR="$(dirname -- "$0")"
# shellcheck source=git-utils.sh
. "$SCRIPT_DIR/git-utils.sh"

is_git_repo

git fetch origin

CHECK_GIT_BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD)"
CHECK_GIT_BRANCH_HASH="$(git rev-parse "$CHECK_GIT_BRANCH_NAME")"

CHECK_GIT_REMOTE_BRANCH_NAME="$(git status -b --porcelain=v2 | grep -m 1 "^# branch.upstream " | cut -d " " -f 3-)"

if [ "$CHECK_GIT_REMOTE_BRANCH_NAME" = '' ]; then
  echo "Branch didn't have remote."
  exit 1;
fi

CHECK_GIT_REMOTE_BRANCH_HASH="$(git rev-parse "$CHECK_GIT_REMOTE_BRANCH_NAME")"

if [ "$CHECK_GIT_BRANCH_HASH" != "$CHECK_GIT_REMOTE_BRANCH_HASH" ]; then
  echo "Branch is not even with it origin"
  exit 2;
fi
