#!/bin/bash

# Fail if attempting to use a variable which hasn't been set.
set -u;
# Stop on first error.
set -e;

# Runs upgrade steps in the sub-folders under here.
# Folders which are less than or equal to the $PREVIOUS_VERSION variable will not get run.

# Define functions to compare versions.
versionLTE() {
    LOWEST=$(echo -e "$1\n$2" | sort -V | head -n1);

    if [ "$1" = "$LOWEST" ]; then
	return 0;
    else
	return 1;
    fi;
}

versionLT() {
    if [ "$1" = "$2" ]; then
	return 1;
    elif versionLTE $1 $2; then
	return 0;
    else
	return 1;
    fi;
}

echo "Running upgrades";
pushd upgrades > /dev/null;
# For everything in the upgrades folder.
for d in $(ls -d * -v); do
    # Check it's a directory.
    if [ -d $d ]; then
	# Check it's after the version the which was installed before.
	if versionLT $PREVIOUS_VERSION $d; then
	    # Check it contains an upgrade.sh file.
	    if [ -f upgrade.sh ]; then
		echo "Running ${d} upgrade";
		pushd $d  > /dev/null;
		source "upgrade.sh";
		popd > /dev/null;
	    fi;
	fi;
    fi;
done;
popd  > /dev/null;
