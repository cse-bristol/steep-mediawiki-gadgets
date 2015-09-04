"use strict";

/*global mediaWiki, jQuery, OO*/

/*

 We are, however, using the same jQuery suggestions plugin [https://github.com/wikimedia/mediawiki/blob/REL1_25/resources/src/jquery/jquery.suggestions.js].
 */
(function(mw, $, OO) {
    mw.hook('wikipage.content').add(function(content) {
	if (!mw.viewingCategoryPage) {
	    return;
	}

	var sort = OO.ui.infuse('sort-category-table');

	sort.on('change', function() {
	    var qs = mw.getHrefWithUpdatedQueryString('sort', sort.getValue().toLowerCase());

	    window.location.assign(qs);
	});

    });
    

}(mediaWiki, jQuery, OO));
