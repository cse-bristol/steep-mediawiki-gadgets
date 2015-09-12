"use strict";

/*global mediaWiki, jQuery, OO*/

/*
 Provides a text box for the user to type a title. Add [[Category:Projects]] to Category:<<TitleUserTyped>> if it isn't already there. Navigate to Category:<<TitleUserType>>

 Shown in the Category:Projects page when you click the 'New Project' button.
*/
(function (mw, $, OO) {
    mw.NewProjectDialogue = function(config) {
	mw.NewDocumentInCategoryDialogue.call(this, config);
    };

    OO.inheritClass(mw.NewProjectDialogue, mw.NewDocumentInCategoryDialogue);

    mw.NewProjectDialogue.static.title = "New project dialogue";
    mw.NewProjectDialogue.static.actions = [
	{ action: 'create-page', label: 'Create', flags: 'primary'},
	{ label: 'Cancel', flags: 'safe' }
    ];

    mw.NewProjectDialogue.prototype.namespace = function() {
	return mw.config.values.wgNamespaceIds.category;
    };

    mw.NewProjectDialogue.prototype.initialize = function() {
	mw.NewProjectDialogue.parent.prototype.initialize.apply(this, arguments);

	var dialogue = this;

	this.form = new OO.ui.FormLayout({
	    items: [this.pageTitle]
	});

	this.form
	    .$element
	    .on('submit', function(e) {
		e.preventDefault();
		dialogue.executeAction('create-page');
	    });

	this.$body.append(this.form.$element);
    };

    mw.NewProjectDialogue.prototype.categoryUserText = function() {
	return "project";
    };

    mw.NewProjectDialogue.prototype.getActionProcess = function(action) {
	var dialogue = this;

	if (action === 'create-page') {
	    return dialogue.createPageInCategory();
	};
	return mw.NewProjectDialogue.parent.prototype.getActionProcess.apply(this, arguments);
    };

}(mediaWiki, jQuery, OO));
