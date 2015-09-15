"use strict";

/*global ve, OO, $*/

ve.ce.SteepNode = function SteepNode(model, config) {
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

OO.inheritClass(ve.ce.SteepNode, ve.ce.LeafNode);

ve.ce.SteepNode.prototype.buildSrc = function(model) {
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

ve.ce.SteepNode.prototype.toolUrl = function() {
    throw new Error("Not implemented: tooUrl should be overriden in subtype.");
};

ve.ce.SteepNode.prototype.srcArgs = function(model) {
    throw new Error("Not implemented: srcArgs should be overridden in subtype.");
};

