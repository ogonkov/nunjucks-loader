#!/bin/sh

is_git_repo() {
  if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Not a git repo."
    exit 1;
  fi
}
