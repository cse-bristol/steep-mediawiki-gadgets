"use strict";

/*global ve, OO, jQuery, steep*/

(function(ve, OO, $, steepVE){

    steepVE.view.Steep = function(model, config) {
	ve.ce.LeafNode.call(this, model, config);

	this.$element = $('<iframe/>')
            .attr('typeof', model.type)
	    .attr('src', this.buildSrc(model))
	    .css("overflow", "hidden");

	if (model.width) {
	    this.$element.css("width", model.width);
	}

	if (model.height) {
	    this.$element.css("height", model.height);
	}
    };

    OO.inheritClass(steepVE.view.Steep, ve.ce.LeafNode);

    steepVE.view.Steep.prototype.buildSrc = function(model) {
	var url = "/" + this.toolUrl() + "/?name=" + encodeURIComponent(model.name),
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

    steepVE.view.Steep.prototype.toolUrl = function() {
	throw new Error("Not implemented: tooUrl should be overriden in subtype.");
    };

    steepVE.view.Steep.prototype.srcArgs = function(model) {
	throw new Error("Not implemented: srcArgs should be overridden in subtype.");
    };

}(ve, OO, jQuery, steep.ve));
