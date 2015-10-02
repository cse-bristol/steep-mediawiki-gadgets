"use strict";

/*global OO, ve, steep*/

(function(OO, ve, steepVE) {

    steepVE.model.Map = function MapNode(options) {
	steepVE.model.Map.super.apply(this, arguments);

    };
    OO.inheritClass(steepVE.model.Map, steepVE.model.Steep);

    steepVE.model.Map.static.matchRdfaTypes = ['mw:Extension/data-map'];
    steepVE.model.Map.static.name = "data-map";

    steepVE.model.Map.static.toDataElement = function(domElements, converter) {
	var d = steepVE.model.Steep.static.toDataElementHelper.apply(this, arguments);
	d.type = steepVE.model.Map.static.name;

	return d;
    };

    steepVE.model.Map.prototype.addModelData = function(data) {
	data.focus = this.focus;
    };

    ve.dm.modelRegistry.register(steepVE.model.Map);

}(OO, ve, steep.ve));
