#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u
# Stop on first error.
set -e

# Outputs a .zip file containing information needed to restore a Steep instance.
# May not be appropriate for very large instances.

# Requires environment variable MYSQL_PASS to have been set (you can find this in LocalSettings.php of your mediawiki directory).
test -n $MYSQL_PASS;

MEDIAWIKI_DIR="/var/www/mediawiki";

BACKUP_DIR="${HOME}/backup";
TODAY=`date +%Y-%m-%d`;
THIS_BACKUP="${BACKUP_DIR}/steep-backup-${TODAY}";
BACKUP_ZIP="${THIS_BACKUP}.zip";

rm -rf "${THIS_BACKUP}";
mkdir -p "${THIS_BACKUP}";

mysqldump --user=mediawiki --password="${MYSQL_PASS}" mediawiki > "${THIS_BACKUP}/mediawiki.sql";
mongodump --db "share" --host "localhost" --out "${THIS_BACKUP}/mongo";
cp -r "${MEDIAWIKI_DIR}/images" "${THIS_BACKUP}/images";

rm -f "${BACKUP_ZIP}";
pushd ${THIS_BACKUP} && zip -r "${BACKUP_ZIP}" * && popd;
rm -rf "${THIS_BACKUP}";
