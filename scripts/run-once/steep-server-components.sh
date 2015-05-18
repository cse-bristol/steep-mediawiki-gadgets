#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

echo "Clone the repositories for the various Steep components.";
if ! [ -d "${PROCESS_MODEL_DIR}" ]; then
    sudo git clone "git@github.com:cse-bristol/process-model.git" "${PROCESS_MODEL_DIR}";
fi;

if ! [ -d "${MAP_DIR}" ]; then
    sudo git clone "git@github.com:cse-bristol/energy-efficiency-planner.git" "${MAP_DIR}";
fi;
if ! [ -d "${SHARE_DIR}" ]; then
    sudo git clone "git@github.com:cse-bristol/share-server.git" "${SHARE_DIR}";
fi;

echo "Sort out permissions so that both the current user and www-data can read and write to them.";
for REPO in "${PROCESS_MODEL_DIR}" "${MAP_DIR}" "${SHARE_DIR}"; do
    sudo find "${REPO}" -type d -exec chmod g+s {} +;
    sudo chown -R "${USER}":steep "${REPO}";
done;

git -C "${MAP_DIR}" submodule update --init;
make -C "${MAP_DIR}";
make -C "${PROCESS_MODEL_DIR}";

echo "Set up share server as a SystemD service.";
sudo ln -f "${SHARE_DIR}/${SHARE_SERVICE}" "/etc/systemd/system/${SHARE_SERVICE}";
sudo systemctl enable "${SHARE_SERVICE}";
