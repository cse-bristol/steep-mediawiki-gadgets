"use strict";

/*global ve, OO, $*/

ve.ce.SteepNode = function SteepNode(model, config) {
    ve.ce.SteepNode.super.apply(this, arguments);
    ve.ce.FocusableNode.call(this);
    ve.ce.ResizableNode.call(this); // resizable, content

    this.$element = $('iframe')
	.attr('src', this.buildSrc(model))
	.attr('style', this.buildStyle(model));
};

OO.inheritClass(ve.ce.SteepNode, ve.ce.LeafNode);
OO.mixinClass(ve.ce.SteepNode, ve.ce.FocusableNode);
OO.mixinClass(ve.ce.SteepNode, ve.ce.ResizableNode);

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

ve.ce.SteepNode.prototype.buildStyle = function(model) {
    var style = "";
    
    if (model.width) {
	style += "width: " + model.width + ";";
    }

    if (model.height) {
	style += "height: " + model.height + ";";
    }

    return style;
};
