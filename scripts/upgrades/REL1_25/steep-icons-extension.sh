#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# The steep icons extension is now separate to the skin.
ln -s -T "${STEEP_DIR}/SteepIcons" "${NEW_DIR}/extensions/SteepIcons";
