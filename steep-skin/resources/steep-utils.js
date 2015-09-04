"use strict";

/*global mediaWiki, jQuery*/

(function(mw, $) {
    mw.isCategoryPage = mw.config.values.wgNamespaceNumber === mw.config.values.wgNamespaceIds.category;
    mw.viewingCategoryPage = mw.isCategoryPage && mw.config.values.wgAction === 'view';

    mw.getHrefWithUpdatedQueryString = function(param, value) {
	/*
	 A function which modifies the query string by setting one parameter to a single value.

	 Any other instances of setting that parameter will be removed/replaced.
	 */
	var fragment = encodeURIComponent(param) + '=' + encodeURIComponent(value),
	    a = document.createElement('a');
	
	a.href = window.location.href;

	if (a.search.length === 0) {
	    a.search = '?' + fragment;
	} else {
	    var didReplace = false,
		// Remove leading '?'
		parts = a.search.substring(1)
	    // Break into pieces
		    .split('&'),

		reassemble = [],
		len = parts.length;

	    for (var i = 0; i < len; i++) {
		
		var pieces = parts[i].split('=');
		if (pieces[0] === param) {
		    if (!didReplace) {
			reassemble.push('&' + fragment);
			didReplace = true;
		    }
		} else {
		    reassemble.push(parts[i]);
		}
	    }

	    if (!didReplace) {
		reassemble.push('&' + fragment);
	    }

	    a.search = '?' + reassemble.join('&');
	}

	return a.href;
    };
    
}(mediaWiki, jQuery));
