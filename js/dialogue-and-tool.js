"use strict";

/*global mediaWiki, ve, OO, jQuery, steep*/

/*
 'Process Model' and 'Map' tools to the insert tool group inside the Visual Editor toolbar.

 This will produce a dialogue box, which allows the user to search for an existing Process Model or Map to insert.
 */
(function(mw, ve, OO, $, steepVE) {
    var makeInsertTool = function(buttonMessage, dialogueMessage, collection, element, modelClass) {
	var dialogueName = collection + " dialogue",
	    toolName = collection + " tool",

	    makeSearchRequest = function(value, callback) {
		$.getJSON(
		    "/channel/search/" + collection,
		    {
			q: value
		    },
		    callback
		);
	    },

	    makeResult = function(value) {
     		return new OO.ui.OptionWidget(
    		    {
			data: {
			    name: value.name
			},
    			label: " " + value.name
    		    }
    		);
	    };

	/*
	 Make the dialogue.
	 */
	var dialogue = function(surface, config) {
	    ve.ui.NodeDialog.call(this, surface, config);
	};

	OO.inheritClass(dialogue, ve.ui.NodeDialog);

	dialogue.static.name = dialogueName;
	dialogue.static.title = mw.message(dialogueMessage).text();
	dialogue.static.actions = [
	    { action: 'save', label: 'Insert', flags: [ 'primary', 'progressive' ] },
	    { action: 'cancel', label: 'Cancel', flags: 'safe' }
	];
	dialogue.static.modelClasses = [modelClass];

	dialogue.prototype.getBodyHeight = function () {
	    return 400;
	};

	dialogue.prototype.getActionProcess = function ( action ) {
	    var that = this;

	    switch (action) {
	    case "cancel":
		return new OO.ui.Process(function() {
		    that.close({
			action: action
		    });
		});

	    case "save":
		return new OO.ui.Process(that.insert);

	    default:
		return dialogue.super.prototype.getActionProcess.call(this, action);
	    }
	};

	dialogue.prototype.initialize = function() {
	    var instance = this,
		currentSelection,

		/*
		 When we're finished with our dialogue, Insert an xml element in the page.
		 */
		insert = function() {
		    var options = {
			name: currentSelection.name,
			width: widthControl.getValue() + "%",
			height: heightControl.getValue() + "px",
			v: instance.version.getValue()
		    },
			model = new modelClass(options)
		    	    .toLinearModel();

		    ve.init.target
		    	.getSurface()
		    	.getModel()
		    	.getFragment()
		    	.insertContent(
		    	    model
		    	);
		    
		    instance.close();
		},

		/*
		 Called when a user clicks on a document in the search list, or when we change the search term.
		 */
		changeSelection = function(data) {
		    currentSelection = data;

		    instance.actions.setAbilities({ "save": !!currentSelection });

		    if (data) {
			instance.version.loadVersions(data.name);
			
		    } else {
			instance.version.clearVersions();
		    }
		},

		/*
		 Fire a search query. Popular the results list when it comes back.
		 */
		doSearch = function() {
		    var value = search.query.value;
		    
		    makeSearchRequest(value, function(results) {
			if (value === search.query.value) {
			    search.results.clearItems();
			    changeSelection();

			    var resultsDict = {};
			    results.forEach(function(r) {
				resultsDict[r.name] = r.v;
			    });
			    
			    if (!(value in resultsDict || value === "")) {
				/* 
				 If the page we're searching for doesn't exist, add an option to create it.
				 */
				var createPage = makeResult({
				    name: value
				});
				createPage.$element.css("color", "red");
				search.results.addItems([
				    createPage
				]);
			    }
			    
			    search.results.addItems(results.map(makeResult));
			} else {
			    // Noop, our search is out of date.
			}
		    });
		},		

		widthControl = new OO.ui.InputWidget({
		    value: "100"
		}),
		width = new OO.ui.FieldLayout(
		    widthControl,
		    {
			label: "Width (100%)"
		    }
		),
		
		heightControl = new OO.ui.InputWidget({
		    value: "600"
		}),
		height = new OO.ui.FieldLayout(
		    heightControl,
		    {
			label: "Height (px)"
		    }
		);


	    this.version = new steepVE.VersionPicker({
		collection: collection
	    });
	    
	    var form = new OO.ui.FieldsetLayout({
		$content: [
		    width.$element,
		    height.$element,
		    this.version.$element
		]
	    }),

		search = new OO.ui.SearchWidget(),
		searchPanel = new OO.ui.PanelLayout({
		    padded: true
		}),

		panel = new OO.ui.PanelLayout({
		    padded: true
		}),

		stack = new OO.ui.StackLayout({
		    continuous: true,
		    scrollable: false,
		    items: [
			panel,
			searchPanel
		    ]
		});

	    OO.ui.ProcessDialog.prototype.initialize.call(this);

	    search.$results.css("height", "34%");
	    searchPanel.$element.css("height", "100%");
	    
	    this.content = stack;
	    this.insert = insert;
	    this.$body.append(this.content.$element);

	    panel.$element.append(form.$element);
	    searchPanel.$element.append(search.$element);

	    widthControl.$input.attr("type", "range");
	    widthControl.$input.attr("min", "0");
	    widthControl.$input.attr("max", "100");
	    widthControl.$input.attr("step", "1");

	    widthControl.$input.on("input", function() {
		width.setLabel(
		    "Width (" + widthControl.value + "%)"
		);
	    });

	    heightControl.$input.attr("type", "number");

	    widthControl.$input.css("width", "100%");
	    heightControl.$input.css("width", "100%");

	    search.query.on("change", doSearch);

	    search.on("select", function(data) {
		if (currentSelection && currentSelection.name === data.name) {
		    // Noop
		} else {
		    changeSelection(data);
		}
	    });

	    doSearch();
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
	"process-model",
	steepVE.model.ProcessModel
    );

    makeInsertTool(
	"visualeditor-mwmap-button",
	"visualeditor-mwmap-dialogue",
	"maps",
	"data-map",
	steepVE.model.Map
    );
    
}(mediaWiki, ve, OO, jQuery, steep.ve));
