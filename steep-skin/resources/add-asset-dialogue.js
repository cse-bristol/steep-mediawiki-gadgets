"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, $, OO) {
    mw.AddAssetDialogue = function(config) {
	mw.NewDocumentInCategoryDialogue.call(this, config);
    };

    OO.inheritClass(mw.AddAssetDialogue, mw.NewDocumentInCategoryDialogue);

    mw.AddAssetDialogue.static.title = "Add asset dialogue";
    mw.AddAssetDialogue.static.actions = [
	{ modes: 'page', action: 'create-page', label: 'Create Page', flags: ['constructive', 'primary'] },
	{ modes: 'page', action: 'back', label: 'Back', flags: 'safe' },
	{ modes: 'choose', action: 'page', label: 'Page', flags: 'constructive' },
	{ modes: 'choose', action: 'file', label: 'File', flags: 'constructive' },
	{ modes: 'choose', label: 'Cancel', flags: 'safe' }
    ];

    // The main namespace
    mw.AddAssetDialogue.prototype.namespace = function() {
	return mw.config.values.wgNamespaceIds[''];
    };

    mw.AddAssetDialogue.prototype.initialize = function() {
	mw.AddAssetDialogue.parent.prototype.initialize.apply(this, arguments);

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

    mw.AddAssetDialogue.prototype.getSetupProcess = function(data) {
	return mw.AddAssetDialogue.super.prototype.getSetupProcess.call(this, data)
	    .next(
		function() {
		    this.actions.setMode('choose');
		},
		this
	    );
    };

    mw.AddAssetDialogue.prototype.getActionProcess = function (action) {
	var dialogue = this;
	
	switch (action) {
	case 'create-page':
	    return dialogue.createPageInCategory(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds['']
	    );
	    
	case 'page':
	    return new OO.ui.Process(function() {
		dialogue.actions.setMode('page');
		dialogue.stack.setItem(dialogue.pagePanel);
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
	    return mw.NewProjectDialogue.parent.prototype.getActionProcess.apply(this, arguments);
	}
    };
    
}(mediaWiki, jQuery, OO));
