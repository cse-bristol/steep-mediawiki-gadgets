"use strict";

/*global mediaWiki, jQuery, OO, steep*/

/*
 Provides a text box for the user to type a title. Add [[Category:Projects]] to Category:<<TitleUserTyped>> if it isn't already there. Navigate to Category:<<TitleUserType>>

 Shown in the Category:Projects page when you click the 'New Project' button.
*/
(function (mw, $, OO, steep) {
    steep.NewProjectDialogue = function() {
	steep.AddToCategoryDialogue.call(this);
    };

    OO.inheritClass(steep.NewProjectDialogue, steep.AddToCategoryDialogue);

    steep.NewProjectDialogue.static.title = "New project dialogue";
    steep.NewProjectDialogue.static.actions = [
	{ action: 'create-page', label: 'Create', flags: 'primary'},
	{ label: 'Cancel', flags: 'safe' }
    ];

    steep.NewProjectDialogue.prototype.initialize = function() {
	steep.NewProjectDialogue.parent.prototype.initialize.apply(this, arguments);

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

    steep.NewProjectDialogue.prototype.focus = function() {
	this.pageTitle.focus();
    };

    steep.NewProjectDialogue.prototype.setCreateAbilities = function(titleValid) {
	this.actions.setAbilities({
	    'create-page': titleValid
	});
    };

    steep.NewProjectDialogue.prototype.getActionProcess = function(action) {
	var dialogue = this;

	if (action === 'create-page') {
	    return new steep.AddToCategoryProcess(dialogue.pageTitle.getValue(), mw.config.values.wgNamespaceIds.category, ['Projects', 'ProjectsAndSubProjects']);
	};
	return steep.NewProjectDialogue.parent.prototype.getActionProcess.apply(this, arguments);
    };

}(mediaWiki, jQuery, OO, steep));
