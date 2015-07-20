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

UNZIPPED_BACKUP=`mktemp -d steep-restore.XXXXXXXX`;
MEDIAWIKI_DIR="/var/www/mediawiki";

unzip "${BACKUP_ZIP}" -d "${UNZIPPED_BACKUP}";

# Recreate the mediawiki database.
source "run-once/mysql-config.sh";
# Restore our data into the mediawiki database.
mysql --user=mediawiki --password="${MYSQL_MEDIAWIKI_PASS}" mediawiki < "${UNZIPPED_BACKUP}/mediawiki.sql";

mongorestore --drop --db "share" --host "localhost" "${UNZIPPED_BACKUP}/mongo";
mv -f "${UNZIPPED_BACKUP}/images" "${MEDIAWIKI_DIR}/images";

rm -rf "${UNZIPPED_BACKUP}";

source "mediawiki-update.sh";
