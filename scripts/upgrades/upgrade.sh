#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Runs upgrade steps in the sub-folders under here.
# Folders which are less than or equal to the $PREVIOUS_VERSION variable will not get run.

# Define functions to compare versions.
versionLTE() {
    [  "$1" = "`echo -e "$1\n$2" | sort -V | head -n1`" ]
}

versionLT() {
    [ "$1" = "$2" ] && return 1 || versionLTE $1 $2;
}

for d in $(ls -d */ -v); do
    pushd $d;
    if [ $(versionLT $PREVIOUS_VERSION $d) && [ -f upgrade.sh ] ]; then
	echo "Running ${d} upgrade";
	source "upgrade.sh";
    fi;
    popd;
done;
	  

