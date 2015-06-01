"use strict";

/*global ve, OO*/

ve.ce.MapNode = function MapNode(model,config) {
    ve.ce.MapNode.super.apply(this, arguments);

    this.$element.addClass("ve-ce-map-node");
};
OO.inheritClass(ve.ce.MapNode, ve.ce.SteepNode);

ve.ce.MapNode.static.name = ve.dm.MapNode.static.name;

ve.ce.MapNode.prototype.toolUrl = function() {
    return "map";
};

ve.ce.MapNode.prototype.srcArgs = function(model) {
    return {
    };
};

ve.ce.nodeFactory.register(ve.ce.MapNode);
