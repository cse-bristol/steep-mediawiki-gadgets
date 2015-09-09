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

	validateTitleAndSetAbilities = function(dialogue) {
	    dialogue.actions.setAbilities({
		create: isValidTitle(dialogue.pageTitle.getValue())
	    });
	};
    
    mw.hook('wikipage.content').add(function(content) {
	if (!mw.viewingCategoryPage) {
	    return;
	}

	var newDocumentButton = OO.ui.infuse('new-category-page'),
	    api = new mw.Api(),
	    category = (function() {
		var title = mw.config.values.wgTitle || "";
		return title.match(/[A-Z][a-z]*/g).join(" ").toLowerCase();
	    }()),

	    isProjects = category === "projects",

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
		placeholder: 'Name of ' + (isProjects ? "project" : category),
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
		    var targetTitle = new mw.Title(
			dialogue.pageTitle.getValue(),
			mw.config.values.wgNamespaceIds.category
		    ),

			fullTitle = targetTitle.getNamespacePrefix() + targetTitle.getName(),
			navigate = function() {
			    window.location.assign(
				targetTitle.getUrl()
			    );
			};

		    api.getCategories(fullTitle)
			.done(function(data) {
			    if (data) {
				var titles = data.map(function(t) {
				    return t.getNamespacePrefix() + t.getName();
				});

				if (titles.indexOf("Category:Projects") >= 0) {
				    // This page is already a project;
				    console.log("already a project", titles);
				    navigate();
				    return;
				}
			    }

			    api
				.postWithEditToken({
				    action: 'edit',
				    title: fullTitle,
				    summary: 'Made this Category into a Project',
				    appendtext: '[[Category:Projects]]',
				    watchlist: 'watch'
				})
				.done(function(data) {
				    if (!data || data.result !== 'Success') {
					console.error('Failed to make page into a project', fullTitle, data);
				    } else {
					navigate();
				    }
				});
			});
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
