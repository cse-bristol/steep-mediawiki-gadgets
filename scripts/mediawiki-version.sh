#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Prepares a new version of Mediawiki in a directory with the version number appended to it.

if ! [ -d ${NEW_DIR} ]; then
    sudo git clone git@github.com:wikimedia/mediawiki.git $NEW_DIR --branch $REL;
fi;

sudo setfacl -R -m g:"${USER}":rwX "${NEW_DIR}";
sudo setfacl -R -m g:www-data:rwX "${NEW_DIR}";
sudo find "${NEW_DIR}" -type d -exec chmod g+s {} +;

# Get PHP Composer - downloading random files from the internet without checking for a signature is a bad idea, but it's what we're stuck with.
pushd "${NEW_DIR}";
wget http://getcomposer.org/composer.phar;

# Install External Libraries
php ./composer.phar install --no-dev;
popd;

# Install Extensions
for EXTENSION in "Cite" "Gadgets" "Interwiki" "WikiEditor" "ConfirmAccount" "VisualEditor" "LiquidThreads" "GraphViz" "MwEmbedSupport" "TimedMediaHandler" "HeaderTabs" "SemanticForms" "SemanticFormsInputs" "SemanticDrilldown" "InputBox" "SyntaxHighlight_GeSHi"; do
    if ! [ -d "${EXT_DIR}/${EXTENSION}" ]; then
	git clone "git@github.com:wikimedia/mediawiki-extensions-${EXTENSION}.git" "${EXT_DIR}/${EXTENSION}" --branch $REL;
    fi;
done;

# R Extension http://www.mediawiki.org/wiki/Extension:R
wget http://mars.wiwi.hu-berlin.de/www-data/RinMW_014_1.tar.gz -N -P "${NEW_DIR}";
tar -C "${NEW_DIR}/extensions" -xf "${NEW_DIR}/RinMW_014_1.tar.gz";
mkdir -p "${NEW_DIR}/Rfiles";
sudo chown www-data:www-data "${NEW_DIR}/Rfiles";

# Visual Editor Core
git -C "${EXT_DIR}/VisualEditor" submodule update --init;

# Semantic Mediawiki V2
pushd "${NEW_DIR}";
php composer.phar require "mediawiki/semantic-media-wiki:${SEMANTIC_REL}";
popd;

# Steep Extensions
if ! [ -d "${EXT_DIR}/steep-mediawiki-gadgets" ]; then
    git clone git@github.com:cse-bristol/steep-mediawiki-gadgets.git "${EXT_DIR}/steep-mediawiki-gadgets";
fi;

# Vector Skin
if ! [ -d "${NEW_DIR}/skins/Vector" ]; then
    git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Vector "${NEW_DIR}/skins/Vector" --branch $REL;
fi;
