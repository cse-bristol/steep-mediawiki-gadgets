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
		items: [this.pageTitle]
	    });

	    this.form
		.$element
		.on('submit', function(e) {
		    e.preventDefault();
		    dialogue.executeAction('create');
		});

	    this.$body.append(this.form.$element);
	};

	NewPageDialogue.prototype.getActionProcess = function(action) {
	    var dialogue = this;

	    if (action === 'create') {
		var targetTitle = new mw.Title(
		    dialogue.pageTitle.getValue(),
		    mw.config.values.wgNamespaceIds.category
		),

		    fullTitle = targetTitle.getNamespacePrefix() + targetTitle.getName(),
		    navigate = function() {
			window.location.assign(
			    targetTitle.getUrl()
			);

			navigated = true;
		    },

		    /*
		     A little explanation of this:
		     
		     We're using OO.ui.Process [https://doc.wikimedia.org/oojs-ui/master/js/#!/api/OO.ui.Process-method-createStep] so that we can have asynchronous callback which update the dialogue process.
		     
		     However, this doesn't appear to pass the result of one async call into the next one, so I'm doing it manually by using these variables.
		     */
		    
		    getCategoriesResult = null,
		    addCategoryResult = null,
		    navigated = false;


		return new OO.ui.Process(
		    function() {
			return api.getCategories(fullTitle)
			    .then(function(data) {
				getCategoriesResult = data;
				return data;
			    });
		    }
		)
		    .next(function() {
			if (getCategoriesResult) {
			    var titles = getCategoriesResult.map(function(t) {
				return t.getNamespacePrefix() + t.getName();
			    });

			    if (titles.indexOf("Category:Projects") >= 0) {
				// This page is already a project;
				console.log("already a project", titles);
				navigate();
				return true;
			    }
			}

			return api
			    .postWithEditToken({
				action: 'edit',
				title: fullTitle,
				summary: 'Made this Category into a Project',
				appendtext: '[[Category:Projects]]',
				watchlist: 'watch'
			    })
			    .then(function(data) {
				addCategoryResult = data;
				return data;
			    });
		    })
		    .next(function() {
			if (navigated) {
			    return true;
			}
			
			if (!addCategoryResult || !addCategoryResult.edit || addCategoryResult.edit.result !== 'Success') {
			    var things = ['Failed to make page into a project', fullTitle, addCategoryResult];
			    console.error(things);
			    return new OO.ui.Error(things.join(' '));
			} else {
			    navigate();
			    return true;
			}
		    });
	    };
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
