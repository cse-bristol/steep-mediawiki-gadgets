#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

echo "Updating the steep server side components.";

git -C "${PROCESS_MODEL_DIR}" fetch;
git -C "${PROCESS_MODEL_DIR}" checkout "#${PROCESS_MODEL_VERSION}";
make -C "${PROCESS_MODEL_DIR}";

git -C "${MAP_DIR}" fetch;
git -C "${MAP_DIR}" checkout "#${MAP_VERSION}";
make -C "${MAP_DIR}";

git -C "${SHARE_DIR}" fetch;
git -C "${SHARE_DIR}" checkout "#${SHARE_VERSION}";
sudo systemctl restart "${SHARE_SERVICE}";