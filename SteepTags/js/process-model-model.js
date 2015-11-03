"use strict";

/*global OO, ve, steep*/

(function(OO, ve, steepVE) {

    steepVE.model.ProcessModel = function ProcessModelNode(options) {
	steepVE.model.ProcessModel.super.apply(this, arguments);
    };
    
    OO.inheritClass(steepVE.model.ProcessModel, steepVE.model.Steep);

    steepVE.model.ProcessModel.static.matchRdfaTypes = ['mw:Extension/process-model'];
    steepVE.model.ProcessModel.static.name = "process-model";

    ve.dm.modelRegistry.register(steepVE.model.ProcessModel);

}(OO, ve, steep.ve));
