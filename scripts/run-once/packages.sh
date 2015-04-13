#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

sudo aptitude update;

sudo DEBIAN_FRONTEND=noninteractive aptitude install 

# Source control
git subversion

# PHP and MySQL required for Mediawiki
php5-common php5-cli php5-fpm php5-mysql php5-apcu
mysql-server mysql-client

# Used by R-extension for Mediawiki
r-base r-cran-ggplot2

# ImageMagick used by both R-extension and Mediawiki
imagemagick

# Our web server
nginx 

# NodeJS and MongoDB used by the server-side components of the Process-Model and Map tools.
nodejs npm nodejs-legacy
mongodb-server mongodb-clients;

# Browserify used to build the process-model and map.
sudo npm install -g browserify;
