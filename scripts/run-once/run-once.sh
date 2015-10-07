#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# The following script needs to be run the first time you set up the Steep platform on a server.

for SCRIPT in "packages.sh" "ufw.sh" "permissions.sh" "parsoid.sh" "nginx.sh" "php-config.sh" "mysql-config.sh" "steep-server-components.sh"; do
    source "run-once/${SCRIPT}";
done;

