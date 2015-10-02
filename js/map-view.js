"use strict";

/*global ve, OO, steep*/

(function(ve, OO, steepVE) {

    steepVE.view.Map = function MapNode(model,config) {
	steepVE.view.Map.super.apply(this, arguments);

	this.$element.addClass("ve-ce-map-node");
    };
    OO.inheritClass(steepVE.view.Map, steepVE.view.Steep);

    steepVE.view.Map.static.name = steepVE.model.Map.static.name;

    steepVE.view.Map.prototype.toolUrl = function() {
	return "map";
    };

    steepVE.view.Map.prototype.srcArgs = function(model) {
	return {
	};
    };

    ve.ce.nodeFactory.register(steepVE.view.Map);

}(ve, OO, steep.ve));

