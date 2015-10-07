#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Set up uncomplicated firewall to block most incoming traffic.
sudo aptitude install -y ufw;
sudo ufw allow from 127.0.0.1;
sudo ufw allow 22/tcp;
sudo ufw allow 80;
sudo ufw allow 443;
sudo ufw enable;
