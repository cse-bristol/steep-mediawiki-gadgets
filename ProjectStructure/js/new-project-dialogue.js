"use strict";

/*global mediaWiki, jQuery, OO*/

/*
 Provides a text box for the user to type a title. Add [[Category:Projects]] to Category:<<TitleUserTyped>> if it isn't already there. Navigate to Category:<<TitleUserType>>

 Shown in the Category:Projects page when you click the 'New Project' button.
*/
(function (mw, $, OO) {
    OO.NewProjectDialogue = function() {
	OO.AddToCategoryDialogue.call(this);
    };

    OO.inheritClass(OO.NewProjectDialogue, OO.AddToCategoryDialogue);

    OO.NewProjectDialogue.static.title = mw.msg('new-project-dialogue');
    OO.NewProjectDialogue.static.actions = [
	{ action: 'create-page', label: mw.msg('create'), flags: 'primary'},
	{ label: mw.msg('cancel'), flags: 'safe' }
    ];

    OO.NewProjectDialogue.prototype.initialize = function() {
	OO.NewProjectDialogue.parent.prototype.initialize.apply(this, arguments);

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

    OO.NewProjectDialogue.prototype.focus = function() {
	this.pageTitle.focus();
    };

    OO.NewProjectDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };

    OO.NewProjectDialogue.prototype.getActionProcess = function(action) {
	var dialogue = this;

	if (action === 'create-page') {
	    return new OO.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds.category,
		[mw.msg('all-projects-page'), mw.msg('all-projects-and-subprojects-page')]
	    );
	};
	return OO.NewProjectDialogue.parent.prototype.getActionProcess.apply(this, arguments);
    };

}(mediaWiki, jQuery, OO));
