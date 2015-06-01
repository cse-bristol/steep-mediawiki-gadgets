"use strict";

/*global OO, ve*/

/*
 A Visual Editor node which represents an XML tag used by the Steep extension.
 */
ve.dm.SteepNode = function SteepNode(options) {
    ve.dm.SteepNode.super.apply(this, arguments);
    ve.dm.FocusableNode.call(this);
    ve.dm.ResizableNode.call(this);

    if (options) {
	this.name = options.name;
	this.v = options.v;
	this.width = options.width;
	this.height = options.height;
    }
};

OO.inheritClass(ve.dm.SteepNode, ve.dm.LeafNode);
OO.mixinClass(ve.dm.SteepNode, ve.dm.FocusableNode);
OO.mixinClass(ve.dm.SteepNode, ve.dm.ResizableNode);

ve.dm.SteepNode.static.matchTagNames = ['iframe'];
ve.dm.SteepNode.static.isContent = true;
ve.dm.SteepNode.static.enableAboutGrouping = true;

ve.dm.SteepNode.static.toDataElementHelper = function(domElements, converter) {
    var iframe = domElements[0],
	data = JSON.parse(
	    iframe.getAttribute("data-mw"));

    return {
	name: data.attrs.name,
	v: data.attrs.v,
	width: data.attrs.width,
	height: data.attrs.height
    };
};

ve.dm.SteepNode.prototype.toLinearModel = function() {
    var data = {
	type: this.type,
	name: this.name,
	v: this.v,
	width: this.width,
	height: this.height
    };
    
    this.addModelData(data);

    return [data];
};
