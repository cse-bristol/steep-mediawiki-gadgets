"use strict";

/*global mediaWiki, jQuery, OO*/

/*

 We are, however, using the same jQuery suggestions plugin [https://github.com/wikimedia/mediawiki/blob/REL1_25/resources/src/jquery/jquery.suggestions.js].
 */
(function(mw, $, OO) {
    var sortAscendingParam = 'sortAscending';

    mw.hook('wikipage.content').add(function(content) {
	if (!mw.viewingCategoryPage) {
	    return;
	}

	var sort = OO.ui.infuse('sort-category-table'),
	    sortAscending = mw.getQueryParam(window.location.href, sortAscendingParam)
		=== 'true'; // Convert string to boolean.

	sort.on('change', function() {
	    var qs = mw.getHrefWithUpdatedQueryString('sort', sort.getValue());

	    window.location.assign(qs);
	});

	var options = $('#sort-category-table')
		.find('.oo-ui-dropdownWidget-handle'),

	    labels = options.find('.oo-ui-labelElement-label'),

	    icons = options.find('.oo-ui-iconElement-icon');

	labels.addClass(sortAscending ? "ascending" : "descending");

	icons.on('click', function(e) {
	    e.preventDefault();
	    e.stopPropagation();

	    window.location.assign(
		mw.getHrefWithUpdatedQueryString(sortAscendingParam, !sortAscending)
	    );
	});
    });


}(mediaWiki, jQuery, OO));
