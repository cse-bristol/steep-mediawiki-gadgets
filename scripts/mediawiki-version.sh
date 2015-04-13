#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Prepares a new version of Mediawiki in a directory with the version number appended to it.

git clone git@github.com:wikimedia/mediawiki.git $NEW_DIR --branch $REL;

# Get PHP Composer - downloading random files from the internet without checking for a signature is a bad idea, but it's what we're stuck with.
wget http://getcomposer.org/composer.phar;

# Install External Libraries
cd "${NEW_DIR}";
php ./composer.phar install --no-dev;

# Install Extensions
for EXTENSION in "Cite" "Gadgets" "Interwiki" "WikiEditor" "ConfirmAccount" "VisualEditor" "LiquidThreads" "GraphViz" "MwEmbedSuport" "TimedMediaHandler" "HeaderTabs" "SemanticForms" "SemanticFormsInputs" "SemanticDrilldown" "InputBox" "MwEmbedSupport" "SyntaxHighlight_GeSHi"; do
git clone "git@github.com:wikimedia/mediawiki-extensions-${EXTENSION}.git" "${EXT_DIR}/${EXTENSION}" --branch $REL;
done;

# R Extension http://www.mediawiki.org/wiki/Extension:R
wget http://mars.wiwi.hu-berlin.de/www-data/RinMW_014_1.tar.gz -P "${NEW_DIR}";
tar -xf RinMW_014_1.tar.gz -C extensions;
mkdir "${NEW_DIR}/Rfiles";
sudo chown www-data:www-data "${NEW_DIR}/Rfiles";

# Visual Editor Core
cd "${EXT_DIR}/VisualEditor";
git submodule update --init;

# Semantic Mediawiki V2
cd $NEW_DIR;
php composer.phar require "mediawiki/semantic-media-wiki:${SEMANTIC_REL}";

# Steep Extensions
git clone git@github.com:cse-bristol/steep-mediawiki-gadgets.git "${EXT_DIR}/steep-mediawiki-gadgets";

# Vector Skin
git clone https://gerrit.wikimedia.org/r/mediawiki/skins/Vector "${NEW_DIR}/skins/Vector" --branch $REL;
