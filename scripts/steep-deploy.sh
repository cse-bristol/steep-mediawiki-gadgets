#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Assumes a Debian (Jessie) system with 'sudo' installed.

# This script installs Mediawiki in two possible scenarios:
# 1. You have an existing version installed and symlinked to /var/www/mediawiki, in which case we will do an upgrade.
# 2. You have no existing version, and will need to set some environment variables when you run this script.

# The file LocalSettings.php will be generated in the case of (1 - fresh install). It will include a require statement to SteepSettings.php. After this, feel free to edit it to have custom settings for that server.

# The file SteepSettings.php will be replaced on every update, and should not be manually edited.

# This script does not handle the case when you want to restore from backed up files, although it could do in the future.

TARGET_DIR="/var/www";

# The name of the branch we'll get for our skins and extensions. 
REL="REL1_25";
MEDIAWIKI_VERSION="1.25.1";
SEMANTIC_REL="2.2.2";
MEDIAWIKI_DIR="${TARGET_DIR}/mediawiki";
NEW_DIR="${MEDIAWIKI_DIR}_${REL}";
EXT_DIR="${NEW_DIR}/extensions";
EXTRA_CONFIG_FILE="SteepSettings.php";
EXTRA_CONFIG="${NEW_DIR}/${EXTRA_CONFIG_FILE}";

PROCESS_MODEL_DIR="${TARGET_DIR}/process-model";
MAP_DIR="${TARGET_DIR}/energy-efficiency-planner";
SHARE_DIR="/opt/shareserver";
SHARE_SERVICE="shareserver.service";

PROCESS_MODEL_VERSION="master";
MAP_VERSION="master";
SHARE_VERSION="master";

if [ -d $MEDIAWIKI_DIR ]; then
    echo "Upgrading existing install";
    
else
    echo "Creating install from scratch";
    # For a fresh install, these variables must have been set:
    test -n $MYSQL_ROOT_PASS;

    test -n $MYSQL_MEDIAWIKI_PASS;

    # The DNS name of this server.
    test -n $WG_SERVER;
    if [[ $WG_SERVER  != "http"* ]]; then
	echo "WG_SERVER variable must begin with http" 1>&2; exit 1;
    fi;

    # The username and password of an admin user.
    test -n $MEDIAWIKI_ADMIN;
    test -n $MEDIAWIKI_ADMIN_PASS;
    
    # An email address which account request notifications will be sent to.
    test -n $ACCOUNT_CONTACT;

    # True if users must confim accounts.
    test -n $CONFIRM_ACCOUNTS;

    # Run pre-requisites for first install
    source "run-once/run-once.sh";
fi;

echo "Preparing the new version.";
source "mediawiki-version.sh";

if [ -d $MEDIAWIKI_DIR ]; then

    echo "Migrating existing files.";
    
    OLD_DIR=`readlink $MEDIAWIKI_DIR`;
    
    # Take down the wiki temporarily.
    sudo unlink ${MEDIAWIKI_DIR};

    # Migrate files from the old version
    cp "${OLD_DIR}/LocalSettings.php" "${NEW_DIR}";

    cp "${OLD_DIR}/images" "${NEW_DIR}" -R;

    # Overwrite SteepSettings.php
    cp "${EXTRA_CONFIG_FILE}" "${EXTRA_CONFIG}";        

else
    rm -f "${NEW_DIR}/LocalSettings.php";
    
    echo "Running Mediawiki's install script.";
    php "${NEW_DIR}/maintenance/install.php" SteepWiki "${MEDIAWIKI_ADMIN}" --server "localhost" --dbname "mediawiki" --pass "${MEDIAWIKI_ADMIN_PASS}" --installdbuser "root" --installdbpass "${MYSQL_ROOT_PASS}" --dbuser "mediawiki" --dbpass "${MYSQL_MEDIAWIKI_PASS}" --email "${ACCOUNT_CONTACT}";

    echo "Adding in Steep settings.";
    LOCAL_SETTINGS="${NEW_DIR}/LocalSettings.php";
    
    echo "\$wgConfirmAccountContact=\"${ACCOUNT_CONTACT}\";" >> "${LOCAL_SETTINGS}";
    echo "\$wgServer=\"${WG_SERVER}\";" >> "${LOCAL_SETTINGS}";
    echo "require_once \"\$IP/${EXTRA_CONFIG_FILE}\";" >> "${LOCAL_SETTINGS}";
    cp "${EXTRA_CONFIG_FILE}" "${EXTRA_CONFIG}";

    if [ "$CONFIRM_ACCOUNTS" = true ] ; then
	cat 'ConfirmUsers.php' >> "${LOCAL_SETTINGS}";
    fi
fi;

# Install Semantic Mediawiki
pushd "${NEW_DIR}";
php composer.phar require "mediawiki/semantic-media-wiki:${SEMANTIC_REL}";
popd;

source "mediawiki-update.sh";

echo "Upgrading and building the other Steep server-side components.";
source "update-steep-server-components.sh";

echo "Pointing the symlink at the newly installed version of mediawiki.";
sudo ln -s ${NEW_DIR} ${MEDIAWIKI_DIR} --no-target-directory;
