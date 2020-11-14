#!/bin/sh

SCRIPT_DIR="$(dirname -- "$0")"
# shellcheck source=git-utils.sh
. "$SCRIPT_DIR/git-utils.sh"

is_git_repo

CHECK_TARGET_BRANCH_NAME=${1:-master}
CHECK_CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$CHECK_TARGET_BRANCH_NAME" != "$CHECK_CURRENT_BRANCH" ]; then
  printf "This is not the %s branch.\n" "$CHECK_TARGET_BRANCH_NAME"
  exit 2;
fi
