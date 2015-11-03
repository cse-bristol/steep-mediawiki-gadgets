#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# The Steep Tags extension is now separate to the skin.
ln -s -T "${STEEP_DIR}/SteepTags" "${NEW_DIR}/extensions/SteepTags";
