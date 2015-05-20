"use strict";

/*global OO, ve*/

ve.dm.ProcessModelNode = function ProcessModelNode() {
    ve.dm.ProcessModelNode.super.apply(this, arguments);
};
OO.inheritClass(ve.dm.ProcessModelNode, ve.dm.SteepNode);

ve.dm.ProcessModelNode.static.matchRdfaTypes = ['mw:Extension/process-model'];
ve.dm.ProcessModelNode.static.name = "process-model";

ve.dm.ProcessModelNode.static.toDataElement = function(domElements, converter) {
    var d = ve.dm.SteepNode.static.toDataElementHelper.apply(this, arguments);
    d.type = ve.dm.ProcessModelNode.static.name;
    return d;
};

ve.dm.modelRegistry.register(ve.dm.ProcessModelNode);


ve.ce.ProcessModelNode = function ProcessModelNode(model,config) {
    ve.ce.ProcessModelNode.super.apply(this, arguments);

    this.$element.addClass("ve-ce-process-model-node");
};
OO.inheritClass(ve.ce.ProcessModelNode, ve.ce.SteepNode);

ve.ce.ProcessModelNode.static.name = ve.dm.ProcessModelNode.static.name;

ve.ce.nodeFactory.register(ve.ce.ProcessModelNode);
