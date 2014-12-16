"use strict";

/*global mw, ve, OO, jQuery*/

/*
 Add a 'Process Model' tool to the insert tool group inside the Visual Editor toolbar.

 This will produce a dialogue box, which allows the user to search for an existing Process Model.
 */
(function() {
    var title = "visualeditor-mwprocessmodel-title",
	dialogueName = "Process Model Dialogue",
	processModelCollection = "process-models",

	makeSearchRequest = function(value, callback) {
	    jQuery.getJSON(
		"/channel/search/process-models",
		{
		    q: value
		},
		callback
	    );
	};

    /*
     Make the dialogue.
     */
    var dialogue = function(surface, config) {
	OO.ui.Dialog.call(this, surface, config);
    };
    OO.inheritClass(dialogue, OO.ui.Dialog);
    dialogue.static.name = dialogueName;
    dialogue.static.titleMessage = title;

    dialogue.prototype.getBodyHeight = function () {
	return 300;
    };

    dialogue.prototype.initialize = function() {
	var instance = this;
	
	OO.ui.Dialog.prototype.initialize.call(this);

	var search = new OO.ui.SearchWidget(),
	    doSearch = function(value, callback) {
		makeSearchRequest(value, function(results) {
		    if (value === search.query.value) {
			callback(results);
			
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
			
			return new OO.ui.OptionWidget(
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
	    ve.init.target
		.getSurface()
		.getModel()
		.getFragment()
		.collapseRangeToEnd()
		.insertContent('<process-model name="' + data + '"/>', false);

	    instance.close();
	});

	this.$body.append(search.$query);
	this.$body.append(search.$results);
    };

    ve.ui.windowFactory.register(dialogue);

    /*
     Make the tool.
     */
    var tool = function(toolGroup, config) {
	ve.ui.Tool.call(this, toolGroup, config);
    };

    OO.inheritClass(tool, ve.ui.Tool);
    tool.static.name = "ProcessModelTool";
    tool.static.title = mw.message(title).text();
    tool.static.dialog = dialogueName;
    tool.prototype.onSelect = function () {
	this.toolbar.getSurface().execute('window', 'open', dialogueName, null);
    };    

    ve.ui.toolFactory.register(tool);

}());
