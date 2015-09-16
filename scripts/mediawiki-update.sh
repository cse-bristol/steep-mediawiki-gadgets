#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Tell a Mediawiki instance that it is ready to go.

echo "Granting write permission on images folder.";
sudo chown -R "${USER}":steep "${NEW_DIR}/images";
sudo chmod g+sw -R "${NEW_DIR}/images";

# We need to do this (in particular the rebuildData.php script) from the mediawiki directory, because something inside the R-extension doesn't check its path properly.
pushd "${NEW_DIR}" > /dev/null;

echo "Running Mediawiki's update script (sorts out the database tables).";
php "${NEW_DIR}/maintenance/update.php";

echo "Refreshing Semantic Data";
php "${NEW_DIR}/extensions/SemanticMediaWiki/maintenance/rebuildData.php";

# Setup the indexes.
echo "Setting up CirrusSearch indexes.";
php "${EXT_DIR}/CirrusSearch/maintenance/updateSearchIndexConfig.php";
php "${EXT_DIR}/CirrusSearch/maintenance/forceSearchIndex.php"

# Run all outstanding jobs.
php "${NEW_DIR}/maintenance/runJobs.php";

popd > /dev/null;
