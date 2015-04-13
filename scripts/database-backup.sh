#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u
# Stop on first error.
set -e

# Outputs a .sql file which you can run to restore your Mediawiki database.
# May not be appropriate for very large instances.
# Does not backup the MongoDB database used by the process-model and map.

# Look up the database password from LocalSettings.php and fill it in here first.
DB_PASS="";
BACKUP_DIR="/home/${USER}/backup";

mkdir -p "${BACKUP_DIR}";
mysqldump --user=mediawiki --password="${DB_PASS}" mediawiki > "${BACKUP_DIR}/mediawiki.sql";
