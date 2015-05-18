#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

DROP_DB="DROP DATABASE IF EXISTS mediawiki";
CREATE_DB="CREATE DATABASE mediawiki;";
GRANT_PRIVILEGES="GRANT ALL PRIVILEGES ON mediawiki.* TO 'mediawiki'@'localhost' IDENTIFIED BY '${MYSQL_MEDIAWIKI_PASS}';";

echo "Setting the MySQL root password - this is allowed to fail if there is already a password set";
sudo mysqladmin --user=root password "${MYSQL_ROOT_PASS}" || true;

echo "Setting up 'mediawiki' MySQL user and database.";
echo "${DROP_DB}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}";
echo "${CREATE_DB}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}";
echo "${GRANT_PRIVILEGES}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}";

