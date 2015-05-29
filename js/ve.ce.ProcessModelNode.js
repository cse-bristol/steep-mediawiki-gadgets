"use strict";

/*global ve, OO*/

ve.ce.ProcessModelNode = function ProcessModelNode(model,config) {
    ve.ce.ProcessModelNode.super.apply(this, arguments);

    this.$element.addClass("ve-ce-process-model-node");
};
OO.inheritClass(ve.ce.ProcessModelNode, ve.ce.SteepNode);

ve.ce.ProcessModelNode.static.name = ve.dm.ProcessModelNode.static.name;

ve.ce.ProcessModelNode.prototype.toolUrl = function() {
    return "process-model";
};

ve.ce.ProcessModelNode.prototype.srcArgs = function(model) {
    return {
	focus: model.focus
    };
};

ve.ce.nodeFactory.register(ve.ce.ProcessModelNode);
