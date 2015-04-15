#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

PARSOID_DIR="/opt/parsoid";
PARSOID_SERVICE="parsoid.service";
CONFIG_TARGET="/etc/systemd/system/${PARSOID_SERVICE}";

echo "Cloning parsoid repository.";
if ! [ -d "${PARSOID_DIR}" ]; then
    sudo git clone git@github.com:wikimedia/parsoid.git "${PARSOID_DIR}";
fi;

sudo cp "${PARSOID_DIR}/api/localsettings.js.example" "${PARSOID_DIR}/api/localsettings.js";
pushd "${PARSOID_DIR}";
sudo npm install;
popd;

echo "Installing parsoid as a SystemD deamon.";
# Hard link the daemon configuration into the config directory (SystemD won't follow soft links).
sudo ln -f "run-once/${PARSOID_SERVICE}" "${CONFIG_TARGET}";

sudo systemctl enable "${PARSOID_SERVICE}";
sudo systemctl start "${PARSOID_SERVICE}";

