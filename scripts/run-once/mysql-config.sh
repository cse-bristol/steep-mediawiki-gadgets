#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

CREATE_DB="CREATE DATABASE IF NOT EXISTS mediawiki;";
GRANT_PRIVILEGES="GRANT ALL PRIVILEGES ON mediawiki.* TO 'mediawiki'@'localhost' IDENTIFIED BY '${MYSQL_MEDIAWIKI_PASS}';";

echo "Setting the MySQL root password";
sudo mysqladmin -u root password "${MYSQL_ROOT_PASS}" || true;

echo "Setting up 'mediawiki' MySQL user and database.";
echo "${CREATE_DB}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}";
echo "${GRANT_PRIVILEGES}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}";

