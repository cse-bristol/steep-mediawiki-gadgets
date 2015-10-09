"use strict";

/*global mediaWiki, jQuery, OO, steep*/

/*
 Provides a selection box which shows the different available versions of a process-model or map.
 */
(function(mw, $, OO, steepVE){
    steepVE.VersionPicker = function(options) {
	if (!options) {
	    throw new Error("VersionPicker needs some options on construction.");
	}
	
	if (!options.collection) {
	    throw new Error("VersionPicker's options should have a 'collection' property to tell it which STEEP collection to look in.");
	};

	this.collection = options.collection;
	
	OO.ui.DropdownInputWidget.call(this, options);
    };

    OO.inheritClass(steepVE.VersionPicker, OO.ui.DropdownInputWidget);

    steepVE.VersionPicker.prototype._clear = function() {
	/*
	 Clear the currently selected value, and remove all the options from the list.

	 Does not affect the currentDocument property;
	 */
	this.setOptions();
    };

    steepVE.VersionPicker.prototype.setOptions = function(options) {
	var result = steepVE.VersionPicker.parent.prototype.setOptions.call(
	    this,
	    [{
		label: 'Latest',
		data: null
	    }].concat(options || [])
	);

	this.setDisabled(
	    !options || !options.length
	);
    };

    var changing = false;

    steepVE.VersionPicker.prototype.setValue = function(v) {
	var i = parseInt(v);

	if (i === this.getValue()) {
	    return;
	}

	if (changing) {
	    // Prevent event loops.
	    return;
	}

	try {
	    changing = true;

	    steepVE.VersionPicker.parent.prototype.setValue.call(
		this,
		isNaN(i) ? null : i
	    );
	} finally {
	    changing = false;
	}
    };
    
    steepVE.VersionPicker.prototype.clearVersions = function() {
	this.currentDocument = null;
	this._clear();
    };

    steepVE.VersionPicker.prototype.getValue = function() {
	var v = steepVE.VersionPicker.parent.prototype.getValue.call(this);
	if (v === 0 || v) {
	    return parseInt(v);
	} else {
	    /*
	     Return null instead of empty string, undefined etc.
	     */
	    return null;
	}
    };

    steepVE.VersionPicker.prototype.loadVersions = function(document, targetVersion) {
	var picker = this;
	
	if (document && this.currentDocument !== document) {
	    picker._clear();
	    picker.currentDocument = document;

	    jQuery.getJSON(
		['/channel', 'versions', picker.collection, document, 0].join('/'),
		{},
		function(data, result) {
		    if (result === 'success') {
			picker.setOptions(
			    data
				.reverse()
				.map(function(r) {
				    return {
					data: r.v,
					label: new Date(r.ts).toLocaleString()
				    };
				})
			);

			if (targetVersion !== undefined) {
			    picker.setValue(targetVersion);
			}
		    } else {
			picker._clear();
			throw new Error(result);
		    }
		}
	    );
	}
    };

}(mediaWiki, jQuery, OO, steep.ve));
