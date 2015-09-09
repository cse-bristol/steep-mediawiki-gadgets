#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

sudo rm -rf "${NEW_DIR}";
sudo mkdir -p "${NEW_DIR}";

# All files created in here will have the same group.
sudo chmod g+s "${NEW_DIR}";
sudo chown "${USER}":steep "${NEW_DIR}";

# Prepares a new version of Mediawiki in a directory with the version number appended to it.
git clone git@github.com:wikimedia/mediawiki.git $NEW_DIR --branch $MEDIAWIKI_VERSION --depth 1;

# Get PHP Composer - downloading random files from the internet without checking for a signature is a bad idea, but it's what we're stuck with.
pushd "${NEW_DIR}" > /dev/null;
wget http://getcomposer.org/composer.phar;
php ./composer.phar update;

# Install External Libraries
php ./composer.phar install --no-dev;

# Install SubPageList
php composer.phar require mediawiki/sub-page-list 1.1.2
popd > /dev/null;

# Install Extensions
for EXTENSION in "Cite" "Gadgets" "Interwiki" "WikiEditor" "ConfirmAccount" "VisualEditor" "LiquidThreads" "GraphViz" "MwEmbedSupport" "TimedMediaHandler" "SemanticForms" "SemanticFormsInputs" "SemanticDrilldown" "InputBox" "SyntaxHighlight_GeSHi"; do
    git clone "git@github.com:wikimedia/mediawiki-extensions-${EXTENSION}.git" "${EXT_DIR}/${EXTENSION}" --branch $REL --depth 1;
done;

# R Extension http://www.mediawiki.org/wiki/Extension:R
wget http://mars.wiwi.hu-berlin.de/www-data/RinMW_014_1.tar.gz -N -P "${NEW_DIR}";
tar -C "${NEW_DIR}/extensions" -xf "${NEW_DIR}/RinMW_014_1.tar.gz";
mkdir -p "${NEW_DIR}/Rfiles";
chmod g+w "${NEW_DIR}/Rfiles";

# # IntraACL http://wiki.4intra.net/IntraACL
# git clone "git@github.com:mediawiki4intranet/IntraACL.git" "${NEW_DIR}/extensions/IntraACL"  --depth 1;
# patch -d "${NEW_DIR}" -p1 < "${NEW_DIR}/extensions/IntraACL/patches/IntraACL-MediaWiki-${MEDIAWIKI_VERSION}.diff";

# Visual Editor Core
git -C "${EXT_DIR}/VisualEditor" submodule update --init;

# Steep Extensions
git clone "git@github.com:cse-bristol/steep-mediawiki-gadgets.git" "${STEEP_DIR}" --branch $REL --depth 1;

# Vector Skin
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Vector "${NEW_DIR}/skins/Vector" --branch $REL --depth 1;
