#!/bin/sh

CHECK_TARGET_BRANCH_NAME=${1:-master}

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Not a git repo."
  exit 1;
fi

CHECK_CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$CHECK_TARGET_BRANCH_NAME" != "$CHECK_CURRENT_BRANCH" ]; then
  printf "This is not the %s branch.\n" "$CHECK_TARGET_BRANCH_NAME"
  exit 2;
fi
