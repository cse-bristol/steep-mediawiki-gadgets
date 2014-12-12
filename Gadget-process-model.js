"use strict";

/*global mw, ve, OO*/

var title = "visualeditor-mwprocessmodel-title";

var translations = {
    en: {
        title: "Process Model"
    }
};

if (!mw.messages.exists(title)) {
    mw.messages.set(title, "Process Model");
}

function ProcessModelTool(toolGroup, config) {
    ve.ui.Tool.call(this, toolGroup, config);
}

OO.inheritClass(ProcessModelTool, ve.ui.Tool);
ProcessModelTool.static.name = "ProcessModelTool";
ProcessModelTool.static.titleMessage = title;

ProcessModelTool.prototype.onSelect = function() {
    alert("Clicked the button");
};
ProcessModelTool.prototype.onUpdateState = function() {
    // Noop
};

ve.ui.toolFactory.register(ProcessModelTool);
