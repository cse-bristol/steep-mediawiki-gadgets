#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

NGINX_CONFIG="/etc/nginx";
SITES_AVAILABLE="${NGINX_CONFIG}/sites-available";
SITES_ENABLED="${NGINX_CONFIG}/sites-enabled";
STEEP_CONFIG="${SITES_AVAILABLE/steep-nginx";

# Disable the default web site.
sudo unlink "${SITES_ENABLED}/default";

sudo cp steep-nginx "${STEEP_CONFIG}";
sudo ln -s "${STEEP_CONFIG}" "${SITES_ENABLED}/steep-nginx" --no-target-directory;

sudo systemctl restart nginx;
