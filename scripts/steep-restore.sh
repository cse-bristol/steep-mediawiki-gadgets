#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u
# Stop on first error.
set -e

# Restores steep data using the zip produced by steep-restore.sh
# Depends on a Steep instance already have been installed on this machine (e.g. by steep-deploy.sh).
# Overwrites any existing data on that instance.

# The location of the zip to restore from.
test -n $BACKUP_ZIP;
# Database passwords.
test -n $MYSQL_ROOT_PASS;
test -n $MYSQL_MEDIAWIKI_PASS;

MEDIAWIKI_DIR="/var/www/mediawiki";
# For mediawiki-update script.
NEW_DIR=$MEDIAWIKI_DIR;
UNZIP_DIR="/tmp/steep-restore";

rm -rf "${UNZIP_DIR}";
unzip "${BACKUP_ZIP}" -d "${UNZIP_DIR}";

# Recreate the mediawiki database.
source "run-once/mysql-config.sh";
# Restore our data into the mediawiki database.
mysql --user=mediawiki --password="${MYSQL_MEDIAWIKI_PASS}" mediawiki < "${UNZIP_DIR}/mediawiki.sql";

mongorestore --drop --db "share" --host "localhost" "${UNZIP_DIR}/mongo";
mv -f "${UNZIP_DIR}/images" "${MEDIAWIKI_DIR}/images";

rm -rf "${UNZIP_DIR}";

source "mediawiki-update.sh";
