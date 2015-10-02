"use strict";

/*global OO, ve, steep*/

(function(OO, ve, steepVE) {

    steepVE.model.ProcessModel = function ProcessModelNode(options) {
	steepVE.model.ProcessModel.super.apply(this, arguments);

	if (options) {
	    this.focus = options.focus;
	}
    };
    OO.inheritClass(steepVE.model.ProcessModel, steepVE.model.Steep);

    steepVE.model.ProcessModel.static.matchRdfaTypes = ['mw:Extension/process-model'];
    steepVE.model.ProcessModel.static.name = "process-model";

    steepVE.model.ProcessModel.static.toDataElement = function(domElements, converter) {
	var d = steepVE.model.Steep.static.toDataElementHelper.apply(this, arguments);
	d.type = steepVE.model.ProcessModel.static.name;

	return d;
    };

    steepVE.model.ProcessModel.prototype.addModelData = function(data) {
	data.focus = this.focus;
    };

    ve.dm.modelRegistry.register(steepVE.model.ProcessModel);

}(OO, ve, steep.ve));
