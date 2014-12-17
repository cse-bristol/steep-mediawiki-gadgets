"use strict";

/*global mw, ve, OO, jQuery*/

/*
 Adds 'Process Model' and 'Map' tools to the insert tool group inside the Visual Editor toolbar.

 This will produce a dialogue box, which allows the user to search for an existing Process Model or Map to insert.
 */
(function() {
    var makeInsertTool = function(buttonMessage, dialogueMessage, collection, element) {
	var dialogueName = collection + " dialogue",
	    toolName = collection + " tool",

	    makeSearchRequest = function(value, callback) {
		jQuery.getJSON(
		    "/channel/search/" + collection,
		    {
			q: value
		    },
		    callback
		);
	    },

	    makeResult = function(value) {
 		return new OO.ui.OptionWidget(
		    value,
		    {
			// Ensure we have a String for the label.
			label: "" + value
		    }
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
	dialogue.static.title = mw.message(dialogueMessage).text();

	dialogue.prototype.getBodyHeight = function () {
	    return 300;
	};

	dialogue.prototype.initialize = function() {
	    var instance = this;
	    
	    OO.ui.Dialog.prototype.initialize.call(this);

	    var search = new OO.ui.SearchWidget(),
		doSearch = function() {
		    var value = search.query.value;
		    
		    makeSearchRequest(value, function(results) {
			if (value === search.query.value) {
			    search.results.clearItems();

			    if (!(value in results || value === "")) {
				/* 
				 If the page we're searching for doesn't exist, add an option to create it.
				 */
				var createPage = makeResult(value);
				createPage.$element.css("color", "red");
				search.results.addItems([
				    createPage
				]);
			    }
			    
			    search.results.addItems(
				results.map(makeResult)
			    );
			    
			} else {
			    // Noop, our search is out of date.
			}
		    });
		};

	    search.query.on("change", doSearch);

	    search.on("select", function(data) {
		ve.init.target
		    .getSurface()
		    .getModel()
		    .getFragment()
		    .collapseRangeToEnd()
		    .insertContent('<' + element + ' name="' + data + '"/>', false);

		instance.close();
	    });

	    doSearch();

	    /*
	     Should be doing this using oojs-ui layouts or something instead, but that's all quite poorly documented.
	     */
	    this.title.$element.css("text-align", "center");
	    this.title.$element.css("width", "100%");
	    this.title.$element.css("font-weight", "bold");
	    this.title.$element.css("display", "block");
	    this.$head.append(this.title.$element);
	    
	    this.$body.append(search.$query);
	    this.$body.append(search.$results);
	    this.$body.css("top", "inherit");
	    this.$body.css("bottom", 0);
	    this.$body.css("height", "300px");
	};

	ve.ui.windowFactory.register(dialogue);

	/*
	 Make the tool.
	 */
	var tool = function(toolGroup, config) {
	    ve.ui.Tool.call(this, toolGroup, config);
	};

	OO.inheritClass(tool, ve.ui.Tool);
	tool.static.name = toolName,
	tool.static.title = mw.message(buttonMessage).text();
	tool.static.dialog = dialogueName;
	tool.prototype.onSelect = function () {
	    this.toolbar.getSurface().execute('window', 'open', dialogueName, null);
	};    

	ve.ui.toolFactory.register(tool);
    };

    makeInsertTool(
	"visualeditor-mwprocessmodel-button",
	"visualeditor-mwprocessmodel-dialogue",
	"process-models",
	"process-model"
    );

    makeInsertTool(
	"visualeditor-mwmap-button",
	"visualeditor-mwmap-dialogue",
	"maps",
	"data-map"
    );
    
}());
