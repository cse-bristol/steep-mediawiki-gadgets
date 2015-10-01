"use strict";

/*global ve, OO, steep*/

(function(ve, OO, steepVE) {
    
    steepVE.view.ProcessModel = function ProcessModelNode(model, config) {
	steepVE.view.ProcessModel.parent.apply(this, arguments);

	this.$element.addClass("ve-ce-process-model-node");
    };
    OO.inheritClass(steepVE.view.ProcessModel, steepVE.view.Steep);

    steepVE.view.ProcessModel.static.name = steepVE.dm.ProcessModelNode.static.name;

    steepVE.view.ProcessModel.prototype.toolUrl = function() {
	return "process-model";
    };

    steepVE.view.ProcessModel.prototype.srcArgs = function(model) {
	return {
	    focus: model.focus
	};
    };

    ve.ce.nodeFactory.register(steepVE.view.ProcessModel);

}(ve, OO, steep.ve));
