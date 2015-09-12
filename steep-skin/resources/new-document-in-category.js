"use strict";

/*global mediaWiki, jQuery, OO*/

/*

 */
(function (mw, $, OO) {
    var titleRegex = new RegExp("^[" + mw.config.values.wgLegalTitleChars + "]{1,256}$"),
	isValidTitle = function(text) {
	    return titleRegex.test(text);
	};

    mw.NewDocumentInCategoryDialogue = function(options) {
	OO.ui.ProcessDialog.call(this, options);
    };

    OO.inheritClass(mw.NewDocumentInCategoryDialogue, OO.ui.ProcessDialog);

    mw.NewDocumentInCategoryDialogue.prototype.initialize = function() {
	mw.NewDocumentInCategoryDialogue.parent.prototype.initialize.apply(this, arguments);

	var dialogue = this;

	this.pageTitle = new OO.ui.TextInputWidget({ 
	    placeholder: 'Name of ' + this.categoryUserText(),
	    validate: this.isValidTitle
	});
	
	this.pageTitle.on("change", function() {
	    dialogue.validateTitleAndSetAbilities();
	});

	this.validateTitleAndSetAbilities();
    };

    mw.NewDocumentInCategoryDialogue.prototype.categoryUserText = function() {
	return this.category.match(/[a-zA-Z0-9].*/g).join(' ').toLowerCase();
    };
    
    mw.NewDocumentInCategoryDialogue.prototype.focus = function() {
	this.pageTitle.focus();
    };
    
    mw.NewDocumentInCategoryDialogue.prototype.isValidTitle = isValidTitle;

    mw.NewDocumentInCategoryDialogue.prototype.validateTitleAndSetAbilities = function() {
	this.actions.setAbilities({
	    'create-page': isValidTitle(this.pageTitle.getValue())
	});
    };

    mw.NewDocumentInCategoryDialogue.prototype.namespace = function() {
	throw new Error('Not implemented - should be implemented in subclass');
    };

    /*
     The function which is called once the user has chosen to create a page.
     */
    mw.NewDocumentInCategoryDialogue.prototype.createPageInCategory = function() {
	var targetTitle = new mw.Title(
	    this.pageTitle.getValue(),
	    this.namespace()
	),
	    category = this.category,
	    
	    fullTitle = targetTitle.getNamespacePrefix() + targetTitle.getName(),
	    
	    
	    navigate = function() {
		window.location.assign(
		    targetTitle.getUrl()
		);
		
		navigated = true;
	    },
	    
	    api = new mw.Api(),

	    navigated = false,
	    getCategoriesResult = null,
	    addCategoryResult = null;
	
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

		    if (titles.indexOf("Category:" + category) >= 0) {
			// This page is already a project;
			console.warn("already a " + category, titles);
			navigate();
			return true;
		    }
		}

		return api
		    .postWithEditToken({
			action: 'edit',
			title: fullTitle,
			summary: 'Added to the ' + category + ' category',
			appendtext: '[[Category:' + category + ']]',
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
		    var things = ['Failed to make page into a ' + category, fullTitle, addCategoryResult];
		    console.error(things);
		    return new OO.ui.Error(things.join(' '));
		} else {
		    navigate();
		    return true;
		}
	    });
    };

}(mediaWiki, jQuery, OO));
