"use strict";

/*global ve, OO, steep*/

(function(ve, OO, steepVE) {

    steepVE.view.Map = function MapNode(model,config) {
	config = config || {};
	config.toolUrl = 'map';
	config.collection = 'maps';
	
	steepVE.view.Map.super.call(this, model, config);

	this.$element.addClass("ve-ce-map-node");
    };
    OO.inheritClass(steepVE.view.Map, steepVE.view.Steep);

    steepVE.view.Map.static.name = steepVE.model.Map.static.name;

    ve.ce.nodeFactory.register(steepVE.view.Map);

}(ve, OO, steep.ve));

