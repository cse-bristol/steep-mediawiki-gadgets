"use strict";

/*global mediaWiki, jQuery, OO*/

/*
 Used when viewing a 'Category:NameOfCategory' page.

 Finds the button #new-category-page and adds click behaviour for it.
 */
(function (mw, $, OO) {
    var titleRegex = new RegExp("^[" + mw.config.values.wgLegalTitleChars + "]{1,256}$"),
	isValidTitle = function(text) {
	    return titleRegex.test(text);
	},

	isCategoryPage = function() {
	    return mw.config.values.wgNamespaceNumber === mw.config.values.wgNamespaceIds.category;
	},

	validateTitleAndSetAbilities = function(dialogue) {
	    dialogue.actions.setAbilities({
		create: isValidTitle(dialogue.pageTitle.getValue())
	    });
	};
    
    mw.hook('wikipage.content').add(function(content) {
	if (!isCategoryPage()) {
	    return;
	}

	var newDocumentButton = OO.ui.infuse('new-category-page'),
	    category = function() {
		var title = mw.config.values.wgTitle || "";
		return title.match(/[A-Z][a-z]*/g).join(" ").toLowerCase();
	    }(),

	    NewPageDialogue = function(config) {
		OO.ui.ProcessDialog.call(this, config);
	    };

	OO.inheritClass(NewPageDialogue, OO.ui.ProcessDialog);

	NewPageDialogue.static.title = "New " + category + " dialogue";
	NewPageDialogue.static.actions = [
	    { action: 'create', label: 'Create', flags: 'primary'},
	    { label: 'Cancel', flags: 'safe' }
	];

	NewPageDialogue.prototype.initialize = function() {
	    NewPageDialogue.parent.prototype.initialize.apply(this, arguments);

	    var dialogue = this;

	    this.pageTitle = new OO.ui.TextInputWidget({ 
		placeholder: 'Name of ' + category,
		validate: isValidTitle
	    });

	    this.pageTitle.on("change", function() {
		validateTitleAndSetAbilities(dialogue);
	    });

	    this.form = new OO.ui.FormLayout({
		items: [this.pageTitle],
		action: 'create'
	    });

	    this.$body.append(this.form.$element);
	};

	NewPageDialogue.prototype.getActionProcess = function(action) {
	    var dialogue = this;

	    if (action === 'create') {
		return new OO.ui.Process(function() {
		    window.location.assign(
			mw.config.values.wgServer
			    + mw.config.values.wgArticlePath
			    .replace(
				    /\$1/,
				encodeURIComponent(
				    "Category:" + dialogue.pageTitle.getValue()
				)
			    )
			    + "?category=" + category
		    );
		});
	    }
	    return NewPageDialogue.parent.prototype.getActionProcess.apply(this, arguments);
	};

	var windowManager = new OO.ui.WindowManager();
	$('body').append(windowManager.$element);
	
	var dialogue = new NewPageDialogue();
	windowManager.addWindows([dialogue]);

	newDocumentButton.on('click', function () {
	    var window = windowManager.openWindow(dialogue)
		    .done(function() {
			validateTitleAndSetAbilities(dialogue);
			dialogue.pageTitle.focus();			
		    });
	});
    });
    
}(mediaWiki, jQuery, OO));
