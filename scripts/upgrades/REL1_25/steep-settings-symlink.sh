#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Make sure SteepSettings.php is symlinked into place.
rm -f "${NEW_DIR}/${EXTRA_CONFIG_FILE}";
ln -s -T "${STEEP_DIR}/scripts/${EXTRA_CONFIG_FILE}" "${NEW_DIR}/${EXTRA_CONFIG_FILE}";
