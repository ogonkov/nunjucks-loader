#!/bin/sh

set -e

SCRIPT_DIR="$(dirname -- "$0")"

# shellcheck source=git-check-branch-name.sh
. "$SCRIPT_DIR/git-check-branch-name.sh"
# shellcheck source=git-check-branch-is-clean.sh
. "$SCRIPT_DIR/git-check-branch-is-clean.sh"
