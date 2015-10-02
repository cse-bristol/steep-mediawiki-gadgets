"use strict";

/*global OO, ve, steep*/

/*
 A Visual Editor node which represents an XML tag used by the Steep extension.
 */
(function(ve, OO, steepVE) {

    steepVE.model.Steep = function(options) {
	steepVE.model.Steep.super.apply(this, arguments);

	if (options) {
	    this.name = options.name;
	    this.v = options.v;
	    this.width = options.width;
	    this.height = options.height;
	}
    };

    OO.inheritClass(steepVE.model.Steep, ve.dm.LeafNode);

    steepVE.model.Steep.static.matchTagNames = ['iframe'];
    steepVE.model.Steep.static.isContent = true;
    steepVE.model.Steep.static.enableAboutGrouping = true;

    steepVE.model.Steep.static.toDomElements =  function (dataElement, doc) {
	if (this.matchTagNames && dataElement.type == this.name) {
	    var tagElement = doc.createElement(this.name);

	    tagElement.setAttribute("name", dataElement.name);
	    tagElement.setAttribute("width", dataElement.width);
	    tagElement.setAttribute("height", dataElement.height);
	    
	    if(dataElement.v){
		tagElement.setAttribute("version", dataElement.v);
	    }
	    
	    return [tagElement];
	} else {
	    throw new Error('ve.dm.Model subclass must match a single tag name or implement toDomElements');
	}
    };

    steepVE.model.Steep.static.toDataElementHelper = function(domElements, converter) {
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

    steepVE.model.Steep.prototype.toLinearModel = function() {
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

}(ve, OO, steep.ve));
