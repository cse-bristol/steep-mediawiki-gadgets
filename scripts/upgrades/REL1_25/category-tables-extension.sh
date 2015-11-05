#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# The category tables extension is now separate to the skin.
ln -s -T "${STEEP_DIR}/CategoryTables" "${NEW_DIR}/extensions/CategoryTables";
