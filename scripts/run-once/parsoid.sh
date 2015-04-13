#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Installs parsoid as a SystemD deamon.
PARSOID_DIR="/opt/parsoid";
PARSOID_SERVICE="parsoid.service";

sudo git clone git@github.com:wikimedia/parsoid.git "${PARSOID_DIR}";
sudo cp "${PARSOID_DIR}/api/localsettings.js.example" "${PARSOID_DIR}/api/localsettings.js";
cd "$PARSOID_DIR";
sudo npm install;

# Hard link the daemon configuration into the config directory (SystemD won't follow soft links).
sudo ln "${PARSOID_SERVICE}" "/etc/systemd/system/${PARSOID_SERVICE}";

systemctl enable "${PARSOID_SERVICE}";
systemctl start "${PARSOID_SERVICE}";

