#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

echo "Updating the steep server side components.";

git -C "${PROCESS_MODEL_DIR}" fetch;
git -C "${PROCESS_MODEL_DIR}" checkout "${PROCESS_MODEL_VERSION}";
make -C "${PROCESS_MODEL_DIR}";

git -C "${MAP_DIR}" fetch;
git -C "${MAP_DIR}" checkout "${MAP_VERSION}";
git -C "${MAP_DIR}" submodule update --init;
make -C "${MAP_DIR}";

git -C "${SHARE_DIR}" fetch;
git -C "${SHARE_DIR}" checkout "${SHARE_VERSION}";
(cd "${SHARE_DIR}" && npm install);

echo "Set up share server as a SystemD service.";
sudo ln -f "${SHARE_DIR}/${SHARE_SERVICE}" "/etc/systemd/system/${SHARE_SERVICE}";
sudo systemctl enable "${SHARE_SERVICE}";
sudo systemctl restart "${SHARE_SERVICE}";
