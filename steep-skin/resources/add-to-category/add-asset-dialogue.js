"use strict";

/*global mediaWiki, jQuery, OO, steep*/

/*
 Abstract class - do not instantiate directly.

 A dialogue which provides options to add a file or page to a category.

 Does this using the add-to-category dialogue and process classes.
 */
(function(mw, $, OO, steep) {
    steep.AddAssetDialogue = function(category) {
	steep.AddToCategoryDialogue.call(this);

	this.category = category;
    };

    OO.inheritClass(steep.AddAssetDialogue, steep.AddToCategoryDialogue);

    steep.AddAssetDialogue.static.title = "Add asset dialogue";
    steep.AddAssetDialogue.static.actions = [
	{ modes: 'page', action: 'create-page', label: 'Create Page', flags: ['constructive', 'primary'] },

	{ modes: 'choose', action: 'page', label: 'Page', flags: 'constructive' },
	{ modes: 'choose', action: 'file', label: 'File', flags: 'constructive' },

	{ modes: ['page', 'category', 'project'], action: 'back', label: 'Back', flags: 'safe' },
	{ modes: 'choose', label: 'Cancel', flags: 'safe' }
    ];

    steep.AddAssetDialogue.prototype.focus = function() {
	// Do nothing.
    };

    steep.AddAssetDialogue.prototype.initialize = function() {
	steep.AddAssetDialogue.parent.prototype.initialize.apply(this, arguments);

	this.emptyPanel = new OO.ui.PanelLayout({});

	this.pageForm = new OO.ui.FormLayout({
	    items: [this.pageTitle]
	});

	this.pagePanel = new OO.ui.PanelLayout({
	    $content: this.pageForm.$element,
	    padded: false,
	    scrollable: false
	});
	
	this.stack = new OO.ui.StackLayout({
	    items: [
		this.emptyPanel,
		this.pagePanel
	    ]
	});
	
	this.$body.append(this.stack.$element);
    };

    steep.AddAssetDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };

    steep.AddAssetDialogue.prototype.getSetupProcess = function(data) {
	return steep.AddAssetDialogue.super.prototype.getSetupProcess.call(this, data)
	    .next(
		function() {
		    this.actions.setMode('choose');
		},
		this
	    );
    };

    steep.AddAssetDialogue.prototype.switchCreateMode = function(mode) {
	this.actions.setMode(mode);
	this.setPlaceholder('Name of' + mode);
	this.stack.setItem(this.pagePanel);
	this.pageTitle.focus();
    };

    steep.AddAssetDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };    

    steep.AddAssetDialogue.prototype.getActionProcess = function (action) {
	var dialogue = this;
	
	switch (action) {
	case 'create-page':
	    return new steep.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds[''],
		[dialogue.category]
	    );
	    
	case 'page':
	    return new OO.ui.Process(function() {
		dialogue.switchCreateMode.call(dialogue, 'page');
		return true;
	    });

	case 'back':
	    return new OO.ui.Process(function() {
		dialogue.actions.setMode('choose');
		dialogue.stack.setItem(dialogue.emptyPanel);
		return true;
	    });
	    
	case 'file':
	    var uploadPage = new mw.Title(
		'Upload',
		mw.config.values.wgNamespaceIds.special
	    );
	    
	    return new OO.ui.Process(function() {
		window.location.assign(
		    uploadPage.getUrl()
		);
		return true;
	    });
	    
	default:
	    return steep.AddAssetDialogue.parent.prototype.getActionProcess.apply(this, arguments);
	}
    };
    
}(mediaWiki, jQuery, OO, steep));
