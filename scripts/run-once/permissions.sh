#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

sudo groupadd -f steep;
sudo usermod -a -G steep "${USER}";
sudo usermod -a -G steep www-data;

