#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# We now distribute a skin with this repository.
# Symlink it into the skins directory.
ln -s -T "${STEEP_DIR}/steep-skin" "${NEW_DIR}/skins/Steep";

# Make sure SteepSettings.php is symlinked into place.
rm -f "${NEW_DIR}/${EXTRA_CONFIG_FILE}";
ln -s -T "${STEEP_DIR}/scripts/${EXTRA_CONFIG_FILE}" "${NEW_DIR}/${EXTRA_CONFIG_FILE}";

# Migrate from MongoDB to ElasticSearch.
source "search.sh";

