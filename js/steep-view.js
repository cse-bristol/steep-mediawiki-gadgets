"use strict";

/*global mediaWiki, ve, OO, jQuery, steep*/

(function(mw, ve, OO, $, steepVE){

    steepVE.view.Steep = function(model, config) {
	if (!config) {
	    throw new Error("No config specified");
	}
	
	ve.ce.LeafNode.call(this, model, config);

	if (!config.toolUrl) {
	    throw new Error("Config must specify a toolUrl property.");
	} else {
	    this.toolUrl = config.toolUrl;
	}

	if (!config.collection) {
	    throw new Error("Config must specifc a collection property.");
	}

	var view = this,
	    url = this.buildSrc(model);
	
	this.$element = $('<div/>')
	    .addClass('steep-node')
            .attr('typeof', model.type)
	    .attr('contenteditable', false)
	    .css("overflow", "hidden");

	this.$tools = $('<div/>')
	    .addClass('steep-view-tools');

	this.setViewpoint = new OO.ui.ButtonInputWidget({
	    label: mw.message('steepve-set-viewpoint'),
	    id: 'steep-set-viewpoint'
	});

	this.history = new steepVE.VersionPicker({
	    label: mw.message('steepve-history'),
	    id: 'steep-history',
	    collection: config.collection
	});

	this.history.loadVersions(model.name, model.v);
	this.history.on('change', function(e) {
	    model.v = view.history.getValue();
	    view.$frame.attr('src', view.buildSrc(model));
	});

	this.popout = new OO.ui.ButtonInputWidget({
	    label: mw.message('steepve-popout'),
	    href: url,
	    id: 'steep-popout'
	});
	this.popout.on('click', function(e) {
	    window.open(
		view.buildSrc(model),
		'_blank'
	    );
	});
	

	this.$tools.append(this.setViewpoint.$element);
	this.$tools.append(this.history.$element);
	this.$tools.append(this.popout.$element);

	this.$frame = $('<iframe/>')
	    .attr('src', url);	

	if (model.width) {
	    this.$frame.css("width", model.width);
	}

	if (model.height) {
	    this.$frame.css("height", model.height);
	}

	this.$element.append(this.$tools);
	this.$element.append(this.$frame);
    };

    OO.inheritClass(steepVE.view.Steep, ve.ce.LeafNode);

    steepVE.view.Steep.prototype.buildSrc = function(model) {
	var url = "/" + this.toolUrl + "/?name=" + encodeURIComponent(model.name),
	    args = this.srcArgs(model);

	args.v = model.v;

	Object.keys(args).forEach(function(k) {
	    var val = args[k];

	    if (val === null || val === undefined || val === "") {
		// No-op
	    } else {
		url += "&" + k + "=" + encodeURIComponent(val);
	    }
	});
	
	return url;
    };

    steepVE.view.Steep.prototype.srcArgs = function(model) {
	throw new Error("Not implemented: srcArgs should be overridden in subtype.");
    };

}(mediaWiki, ve, OO, jQuery, steep.ve));
