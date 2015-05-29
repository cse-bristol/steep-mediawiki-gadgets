"use strict";

/*global OO, ve*/

ve.dm.ProcessModelNode = function ProcessModelNode(options) {
    ve.dm.ProcessModelNode.super.apply(this, arguments);

    if (options) {
	this.focus = options.focus;
    }
};
OO.inheritClass(ve.dm.ProcessModelNode, ve.dm.SteepNode);

ve.dm.ProcessModelNode.static.matchRdfaTypes = ['mw:Extension/process-model'];
ve.dm.ProcessModelNode.static.name = "process-model";

ve.dm.ProcessModelNode.static.toDataElement = function(domElements, converter) {
    var d = ve.dm.SteepNode.static.toDataElementHelper.apply(this, arguments);
    d.type = ve.dm.ProcessModelNode.static.name;

    return [d];
};

ve.dm.ProcessModelNode.prototype.addModelData = function(data) {
    data.focus = this.focus;
};

ve.dm.modelRegistry.register(ve.dm.ProcessModelNode);
