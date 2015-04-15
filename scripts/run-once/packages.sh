#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

echo "Installing packages";
echo "Updating package repository";
sudo aptitude update;

echo "Source control";
sudo aptitude install git subversion -y;

echo "PHP and MySQL required for Mediawiki";
sudo aptitude install php5-common php5-cli php5-fpm php5-mysql php5-apcu -y;
sudo DEBIAN_FRONTEND=noninteractive aptitude install mysql-server mysql-client -y;

echo "Used by R-extension for Mediawiki";
sudo aptitude install r-base r-cran-ggplot2 -y;

echo "ImageMagick used by both R-extension and Mediawiki";
sudo aptitude install imagemagick -y;

echo "Our web server";
sudo aptitude install nginx -y;

echo "NodeJS and MongoDB used by the server-side components of the Process-Model and Map tools.";
sudo aptitude install nodejs npm nodejs-legacy -y;
sudo aptitude install mongodb-server mongodb-clients -y;

echo "Browserify used to build the process-model and map.";
sudo npm install -g browserify;
