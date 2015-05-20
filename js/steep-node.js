"use strict";

/*global OO, ve*, $/

/*
 A Visual Editor node which represents an XML tag used by the Steep extension.
 */
ve.dm.SteepNode = function SteepNode() {
    ve.dm.SteepNode.super.apply(this, arguments);
    // ve.dm.FocusableNode.call(this);
    ve.dm.ResizableNode.call(this);
};

OO.inheritClass(ve.dm.SteepNode, ve.dm.LeafNode);
OO.mixinClass(ve.dm.SteepNode, ve.dm.FocusableNode);
OO.mixinClass(ve.dm.SteepNode, ve.dm.ResizableNode);

ve.dm.SteepNode.static.matchTagNames = ['iframe'];
ve.dm.SteepNode.static.isWrapped = false;
ve.dm.SteepNode.static.isContent = true;
ve.dm.SteepNode.static.enableAboutGrouping = true;

// ve.dm.SteepNode.static.toDomElements = function(data, converter) {
//     console.log("toDomElements", data, converter);
//     return "";
// };

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

ve.ce.SteepNode = function SteepNode(model, config) {
    ve.ce.SteepNode.super.apply(this, arguments);
    // ve.ce.FocusableNode.call(this);
    ve.ce.ResizableNode.call(this);
};

OO.inheritClass(ve.ce.SteepNode, ve.ce.LeafNode);
// OO.mixinClass(ve.ce.SteepNode, ve.ce.FocusableNode);
OO.mixinClass(ve.ce.SteepNode, ve.ce.ResizableNode);
