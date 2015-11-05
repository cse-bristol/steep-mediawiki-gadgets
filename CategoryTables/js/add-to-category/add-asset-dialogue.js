"use strict";

/*global mediaWiki, jQuery, OO*/

/*
 Abstract class - do not instantiate directly.

 A dialogue which provides options to add a file or page to a category.

 Does this using the add-to-category dialogue and process classes.
 */
(function(mw, $, OO) {
    OO.AddAssetDialogue = function(category) {
	OO.AddToCategoryDialogue.call(this);

	this.category = category;
    };

    OO.inheritClass(OO.AddAssetDialogue, OO.AddToCategoryDialogue);

    OO.AddAssetDialogue.static.title = mw.msg('add-asset-dialogue');
    OO.AddAssetDialogue.static.actions = [
	{ modes: 'page', action: 'create-page', label: mw.msg('add-asset-page'), flags: ['constructive', 'primary'] },

	{ modes: 'choose', action: 'page', label: mw.msg('add-asset-mode-page'), flags: 'constructive' },
	{ modes: 'choose', action: 'file', label: mw.msg('add-asset-mode-file'), flags: 'constructive' },

	{ modes: ['page', 'category', 'project'], action: 'back', label: mw.msg('back'), flags: 'safe' },
	{ modes: 'choose', label: mw.msg('cancel'), flags: 'safe' }
    ];

    OO.AddAssetDialogue.prototype.focus = function() {
	// Do nothing.
    };

    OO.AddAssetDialogue.prototype.initialize = function() {
	OO.AddAssetDialogue.parent.prototype.initialize.apply(this, arguments);

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

    OO.AddAssetDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };

    OO.AddAssetDialogue.prototype.getSetupProcess = function(data) {
	return OO.AddAssetDialogue.super.prototype.getSetupProcess.call(this, data)
	    .next(
		function() {
		    this.actions.setMode('choose');
		},
		this
	    );
    };

    OO.AddAssetDialogue.prototype.switchCreateMode = function(mode) {
	this.actions.setMode(mode);
	this.setPlaceholder(mw.msg('add-asset-name-of') + ' ' + mode);
	this.stack.setItem(this.pagePanel);
	this.pageTitle.focus();
    };

    OO.AddAssetDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };    

    OO.AddAssetDialogue.prototype.getActionProcess = function (action) {
	var dialogue = this;
	
	switch (action) {
	case 'create-page':
	    return new OO.AddToCategoryProcess(
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
	    return OO.AddAssetDialogue.parent.prototype.getActionProcess.apply(this, arguments);
	}
    };
    
}(mediaWiki, jQuery, OO));
