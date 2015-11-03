"use strict";

/*global mediaWiki, jQuery, OO*/

/*
 A process which operates on a title, a namespace, a list of categories.

 Checks whether the page matching the title and namespace belongs to all the cateogries in the list. If it does not, adds the missing categories.

 Navigates to the page.
 */
(function (mw, $, OO) {
    OO.AddToCategoryProcess = function(title, namespace, categories) {
	if (!title) {
	    throw new Error("Must specify options.title");
	}

	namespace = namespace || mw.config.values.wgNamespaceIds[''];
	categories = categories || [];

	var api = new mw.Api(),
	    mwTitle = new mw.Title(
		(categories.length ? categories[0] + '/' : '') + title,
		namespace
	    ),
	    
	    navigated = false,
	    getCategoriesResult = null,
	    missingCategories = [],
	    addCategoryResult = null,

	    navigate = function() {
		window.location.assign(
		    mwTitle.getUrl()
		);
		
		navigated = true;
	    };

	OO.ui.Process.call(
	    this,
	    api.getCategories(mwTitle.toString())
		.then(function(data) {
		    getCategoriesResult = data;
		    return data;
		})
	);

	this
	    .next(function() {
		if (getCategoriesResult) {
		    missingCategories = jQuery(
			getCategoriesResult
			    .map(function(t) {
				return t.getName();
			    })
		    ).not(
			categories
		    );
		} else {
		    missingCategories = categories;
		}

		if (missingCategories.length) {
		    var text = missingCategories.map(function(c) {
			return '[[Category:' + c + ']]';
		    }).join(' ');
		    
		    return api
			.postWithEditToken({
			    action: 'edit',
			    title: mwTitle.toString(),
			    summary: 'Added to the ' + missingCategories.join(', ') + ' categories',
			    appendtext: text,
			    watchlist: 'watch'
			})
			.then(function(data) {
			    addCategoryResult = data;
			    return data;
			});
		} else {
		    navigate();
		    return true;
		}
	    })
	    .next(function() {
		if (navigated) {
		    return true;
		}
		
		if (!addCategoryResult || !addCategoryResult.edit || addCategoryResult.edit.result !== 'Success') {
		    var things = ['Failed to add categories to page', mwTitle.toString(), addCategoryResult];
		    console.error(things.concat(missingCategories));
		    return new OO.ui.Error(things.join(' '));
		} else {
		    navigate();
		    return true;
		}
	    });
    };

    OO.inheritClass(OO.AddToCategoryProcess, OO.ui.Process);
    
}(mediaWiki, jQuery, OO));

