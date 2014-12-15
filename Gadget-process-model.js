"use strict";

/*global mw, ve, OO*/

(function() {
    var title = "visualeditor-mwprocessmodel-title",
	dialogueName = "Process Model Dialogue",
	processModelCollection = "process-models",
	queryUrl = blah,

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

	var search = new ve.ui.SearchWidget(),
	    doSearch = function(value, callback) {
		makeSearchRequest(function(results, error) {
		    if (value === search.query.value) {
			if (error) {
			    throw new Error(error);
			} else {
			    callback(results);
			}
			
		    } else {
			// Noop, our search is out of date.
		    }
		});
	    };

	search.query.on("change", function() {
	    doSearch(search.query.value, function(results) {
		search.results.clearItems();
		search.results.addItems(
		    results.map(function(r) {
			
			return new ve.ui.OptionWidget(
			    r,
			    {
				// Ensure we have a String for the label.
				label: "" + r
			    }
			);
		    })
		);
	    });
	});

	search.on("select", function(data) {
	    alert("Selected " + data);
	});

	this.$body.append(search.$query);
	this.$body.append(search.$results);
    };

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
