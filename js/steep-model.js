"use strict";

/*global OO, ve, steep*/

/*
 A Visual Editor node which represents an XML tag used by the Steep extension.
 */
(function(ve, OO, steepVE) {

    steepVE.model.Steep = function(options) {
	steepVE.model.Steep.super.apply(this, arguments);
    };

    OO.inheritClass(steepVE.model.Steep, ve.dm.LeafNode);

    steepVE.model.Steep.static.matchTagNames = ['iframe'];
    steepVE.model.Steep.static.isContent = true;
    steepVE.model.Steep.static.enableAboutGrouping = true;
    steepVE.model.Steep.static.preserveHtmlAttributes = false;

    steepVE.model.Steep.static.toDomElements =  function (dataElement, doc) {
	if (this.matchTagNames && dataElement.type == this.name) {
	    var tagElement = doc.createElement(this.name),
		attrs = dataElement.attributes;

	    tagElement.setAttribute("name", attrs.name);
	    tagElement.setAttribute("width", attrs.width);
	    tagElement.setAttribute("height", attrs.height);
	    
	    if(!isNaN(parseInt(attrs.v))) {
	    	tagElement.setAttribute("v", attrs.v);
	    }

	    return [tagElement];
	} else {
	    throw new Error('ve.dm.Model subclass must match a single tag name or implement toDomElements');
	}
    };

    steepVE.model.Steep.static.toDataElement = function(domElements, converter) {
	var iframe = domElements[0],
	    data = JSON.parse(
		iframe.getAttribute("data-mw"));

	return {
	    type: data.name,
	    attributes: data.attrs
	};
    };

    steepVE.model.Steep.static.toLinearModel = function(type, name, v, width, height) {
	return [{
	    type: type,
	    attributes: {
		name: name,
		v: v,
		width: width,
		height: height
	    }
	}];
    };

}(ve, OO, steep.ve));
