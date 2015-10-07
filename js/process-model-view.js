"use strict";

/*global ve, OO, steep*/

(function(ve, OO, steepVE) {
    
    steepVE.view.ProcessModel = function ProcessModelNode(model, config) {
	config = config || {};
	config.toolUrl = 'process-model';
	config.collection = 'process-models';
	
	steepVE.view.ProcessModel.parent.call(this, model, config);

	this.$element.addClass("ve-ce-process-model-node");
    };
    OO.inheritClass(steepVE.view.ProcessModel, steepVE.view.Steep);

    steepVE.view.ProcessModel.static.name = steepVE.model.ProcessModel.static.name;

    ve.ce.nodeFactory.register(steepVE.view.ProcessModel);

}(ve, OO, steep.ve));
