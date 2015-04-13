#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Turn on the PHP opcache to significantly improve performance.
PHP_FPM_CONFIG="/etc/php5/fpm/php.ini";
sudo patch -N "${PHP_FPM_CONFIG}" "php.ini.patch";
sudo systemctl restart php5-fmp
