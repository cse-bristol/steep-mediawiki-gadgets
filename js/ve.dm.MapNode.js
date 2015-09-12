"use strict";

/*global OO, ve*/

ve.dm.MapNode = function MapNode(options) {
    ve.dm.MapNode.super.apply(this, arguments);

};
OO.inheritClass(ve.dm.MapNode, ve.dm.SteepNode);

ve.dm.MapNode.static.matchRdfaTypes = ['mw:Extension/data-map'];
ve.dm.MapNode.static.name = "data-map";

ve.dm.MapNode.static.toDataElement = function(domElements, converter) {
    var d = ve.dm.SteepNode.static.toDataElementHelper.apply(this, arguments);
    d.type = ve.dm.MapNode.static.name;

    return d;
};

ve.dm.MapNode.prototype.addModelData = function(data) {
    data.focus = this.focus;
};

ve.dm.modelRegistry.register(ve.dm.MapNode);
