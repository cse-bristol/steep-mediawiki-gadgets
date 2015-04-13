#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Sets the root password, then creates a 'mediawiki' user.

CREATE_MEDIAWIKI_USER="CREATE USER 'mediawiki'@'localhost' IDENTIFIED BY '${MYSQL_MEDIAWIKI_PASS}'; CREATE DATABASE mediawiki; GRANT ALL PRIVILEGES ON mediawiki.* TO 'mediawiki'@'localhost';";

mysqladmin -u root password "${MYSQL_ROOT_PASS}";

echo "${CREATE_MEDIAWIKI_USER}" | mysql --user "root" --password="${MYSQL_ROOT_PASS}" mediawiki < mediawiki-user.sql;
