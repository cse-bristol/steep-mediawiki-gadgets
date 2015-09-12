"use strict";

/*global OO, ve*/

/*
 A Visual Editor node which represents an XML tag used by the Steep extension.
 */
ve.dm.SteepNode = function SteepNode(options) {
    ve.dm.SteepNode.super.apply(this, arguments);

    if (options) {
	this.name = options.name;
	this.v = options.v;
	this.width = options.width;
	this.height = options.height;
    }
};

OO.inheritClass(ve.dm.SteepNode, ve.dm.LeafNode);

ve.dm.SteepNode.static.matchTagNames = ['iframe'];
ve.dm.SteepNode.static.isContent = true;
ve.dm.SteepNode.static.enableAboutGrouping = true;

ve.dm.SteepNode.static.toDomElements =  function ( dataElement, doc ) {
    if ( this.matchTagNames && dataElement.type == this.name) {
	        var processModel = doc.createElement ( this.name )

	        processModel.setAttribute("name", dataElement.name);
	        processModel.setAttribute("version", dataElement.v);
	        processModel.setAttribute("width", dataElement.width);
	        processModel.setAttribute("height", dataElement.height);
	        
	        return [processModel];
    }
    throw new Error( 've.dm.Model subclass must match a single tag name or implement toDomElements' );
};

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
