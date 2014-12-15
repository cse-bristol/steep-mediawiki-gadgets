"use strict";

/*global mw, ve, OO*/

(function() {
    var title = "visualeditor-mwprocessmodel-title",

	translations = {
	    en: {
		title: "Process Model"
	    }
	};

    if (!mw.messages.exists(title)) {
	mw.messages.set(title, "Process Model");
    }

    var tool = function(toolGroup, config) {
	ve.ui.Tool.call(this, toolGroup, config);
    };

    OO.inheritClass(tool, ve.ui.Tool);
    tool.static.name = "ProcessModelTool";
    tool.static.titleMessage = title;

    tool.prototype.onSelect = function() {
	alert("Clicked the button");
    };
    tool.prototype.onUpdateState = function() {
	// Noop
    };

    ve.ui.toolFactory.register(tool);

}());
