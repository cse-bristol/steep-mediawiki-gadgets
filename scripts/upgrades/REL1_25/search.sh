#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# We now use ElasticSearch to store process-models and maps. We also use it to provide search in the wiki, using the CirrusSearch extension. 

# First, install ElasticSearch.
# The Debian elasticsearch package is quite old. We'll use a newer version provided by the Elasticsearch developers.
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -;
echo "deb http://packages.elastic.co/elasticsearch/1.7/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-1.7.list;
sudo aptitude update -y;
sudo aptitude install openjdk-7-jre;
# Make sure there's no existing ElasticSearch config.
sudo aptitude purge elasticsearch -y;
sudo aptitude install elasticsearch -y;

# Set ElasticSearch up as a daemon.
echo "START_DAEMON=true" | sudo tee -a /etc/default/elasticsearch;
# CirrusSearch runs Groovy scripts.
echo "script.disable_dynamic: false" | sudo tee -a /etc/elasticsearch/elasticsearch.yml;

sudo systemctl enable elasticsearch;
sudo systemctl restart elasticsearch;

# Add extensions
for EXTENSION in "Elastica" "CirrusSearch"; do
    git clone "git@github.com:wikimedia/mediawiki-extensions-${EXTENSION}.git" "${EXT_DIR}/${EXTENSION}" --branch $REL --depth 1;
done;

# Add search settings to SteepSettings.php
cp "CirrusSettings.php" "${NEW_DIR}";
echo "require_once \"\$IP/CirrusSettings.php\";" >> "${EXTRA_CONFIG}";

# Run composer install in Elastica (need to pushd the directory).
echo "Installing Elasticata";
pushd "${EXT_DIR}/Elastica" > /dev/null;
php "${NEW_DIR}/composer.phar" install --no-dev;
popd /dev/null;

# Setup the indexes.
echo "Setting up CirrusSearch indexes.";
php "${EXT_DIR}/CirrusSearch/maintenance/updateSearchIndexConfig.php";
php "${EXT_DIR}/CirrusSearch/maintenance/forceSearchIndex.php"

# Install dependencies for database migration, then run it.
npm install;
node data-migration.js;
