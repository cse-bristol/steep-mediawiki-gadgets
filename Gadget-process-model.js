"use strict";

/*global mw, ve, OO*/

(function() {
    var title = "visualeditor-mwprocessmodel-title",
	dialogueName = "Process Model Dialogue",

	translations = {
	    en: {
		title: "Process Model"
	    }
	};

    if (!mw.messages.exists(title)) {
	mw.messages.set(title, "Process Model");
    }

    /*
     Make the dialogue.
     */
    var dialogue = function(surface, config) {
	config = config ? config : {};
	config.small = true;

	ve.ui.Dialog.call(this, surface, config);
    };
    OO.inheritClass(dialogue, ve.ui.Dialog);
    dialogue.static.name = dialogueName;
    dialogue.static.titleMessage = title;


    dialogue.prototype.initialize = function() {
	ve.ui.Dialog.prototype.initialize.call(this);
	// TODO make the dialogue do things
    };

    // TODO work out if I need to do this.
    // dialogue.prototype.onDocumentTransact = function() {
    // };

    ve.ui.dialogFactory.register(dialogue);

    /*
     Make the tool.
     */
    var tool = function(toolGroup, config) {
	ve.ui.DialogTool.call(this, toolGroup, config);
    };

    OO.inheritClass(tool, ve.ui.DialogTool);
    tool.static.name = "ProcessModelTool";
    tool.static.titleMessage = title;
    tool.static.dialog = dialogueName;

    ve.ui.toolFactory.register(tool);

}());
