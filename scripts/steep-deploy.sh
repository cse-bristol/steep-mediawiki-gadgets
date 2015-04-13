#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Assumes a Debian (Jessie) system with 'sudo' installed.
TARGET_DIR="/var/www";

REL="REL1_25";
SEMANTIC_REL="2.1.3";
MEDIAWIKI_DIR="${TARGET_DIR}/mediawiki";
NEW_DIR="${MEDIAWIKI_DIR}_${REL}";
EXT_DIR="${NEW_DIR}/extensions";
EXTRA_CONFIG_FILE="server-specific-variables.php";
EXTRA_CONFIG="${NEW_DIR}/${EXTRA_CONFIG_FILE}";

PROCESS_MODEL_DIR="${TARGET_DIR}/process-model";
MAP_DIR="${TARGET_DIR}/energy-efficiency-planner";
SHARE_DIR="/opt/shareserver";
SHARE_SERVICE="shareserver.service";

PROCESS_MODEL_VERSION="v0.5.0";
MAP_VERSION="v0.5.0";
SHARE_VERSION="v0.5.0";

if [ -d $MEDIAWIKI_DIR ]; then
    # There's an existing version.
    
else
    # For a fresh install, these variables must have been set:
    [ -z $MYSQL_ROOT_PASS ];
    [ -z $MYSQL_MEDIAWIKI_PASS ];
    # The DNS name of this server.
    [ -z $WG_SERVER ];
    # An email address which account request notifications will be sent to.
    [ -z $ACCOUNT_CONTACT ];
    
    # Run pre-requisites for first install
    source "run-once/run-once.sh";
fi;

# Prepare the new version. 
source "mediawiki-version.sh";

if [ -d $MEDIAWIKI_DIR ]; then

    OLD_DIR=(readlink $MEDIAWIKI_DIR);
    OLD_EXTRA_CONFIG="${OLD_DIR}/${EXTRA_CONFIG_FILE}";    
    
    # Take down the wiki temporarily.
    rm ${MEDIAWIKI_DIR};

    # Migrate files from the old version
    cp "${OLD_DIR}/LocalSettings.php" "${NEW_DIR}";

    if [ -e $OLD_EXTRA_CONFIG ]; then
	cp "${OLD_EXTRA_CONFIG}" "${NEW_EXTRA_CONFIG}";
    fi;

    cp "${OLD_DIR}/images" "${NEW_DIR}" -R;

    source "upgrade-steep-server-components.sh";

else
    # Provide default settings, adding in our server-specific configuration.
    cp "LocalSettings.php.default" "${NEW_DIR}/LocalSettings.php";

    EXTRA_CONFIG="${NEW_DIR}/${EXTRA_CONFIG_FILE}";
    
    echo "<?php" > $EXTRA_CONFIG;
    echo "\$wgDBPassword=\"${MYSQL_MEDIAWIKI_PASS}\";" >> $EXTRA_CONFIG;
    echo "\$wgConfirmAccountContract=\"${ACCOUNT_CONTACT}\";" >> $EXTRA_CONFIG;
    echo "\$wgServer=\"${WG_SERVER}\"" >> $EXTRA_CONFIG;
    echo "?>" >> $EXTRA_CONFIG;
fi;

# Make sure the database tables are up to date.
sudo php "${NEW_DIR}/maintenance/update.php";

# Refresh Semantic Data
sudo php "${EXT_DIR}/SemanticMediaWiki/maintenance/rebuildData.php";

# Upgrade the other Steep server-side components.
source "update-steep-server-components.sh";

# Point the symlink at the newly installed version of mediawiki.
ln -s ${NEW_DIR} ${MEDIAWIKI_DIR} --no-target-directory;
