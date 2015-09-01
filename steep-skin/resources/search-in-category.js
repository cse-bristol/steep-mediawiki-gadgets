"use strict";

/*global mediaWiki, jQuery*/

/*
 Search behaviour for a search box which is displayed as part of a Category when using the Steep skin.

 The search box will have suggestion as you type.

 The results will be constrained to be within the Category the user is viewing.

 For the standard search behaviour (which we are not using), see [https://github.com/wikimedia/mediawiki/blob/REL1_25/resources/src/mediawiki/mediawiki.searchSuggest.js].

 We are, however, using the same jQuery suggestions plugin [https://github.com/wikimedia/mediawiki/blob/REL1_25/resources/src/jquery/jquery.suggestions.js].
 */
(function(mw, $) {
    var isCategoryPage = function() {
	return mw.config.values.wgNamespaceNumber === mw.config.values.wgNamespaceIds.category;
    };

    mw.hook('wikipage.content').add(function(content) {
	if (!isCategoryPage()) {
	    return;
	}

	var category = mw.config.values.wgTitle,
	    inCategory = 'incategory:"' + category + '" ',
	    searchTitle = new mw.Title("Search", mw.config.values.wgNamespaceIds.special),
	    api = new mw.Api(),

	    queryOnSearchPage = function(query) {
		return searchTitle.getUrl()
		    + "?search=" + inCategory + query
		    + "&fulltext=1";
	    },
	    
	    searchForms = $('.search-form')
		.on('submit', function(e) {
		    e.preventDefault();		    
		    
		    window.location.assign(
		    	"?search=" + inCategory + $(this).find('input')[0].value
		    );    
		}),
	    searchInputs = searchForms.find('input');

	searchInputs.suggestions({
	    fetch: function(query, response, maxRows) {
		var request = api
			.get({
			    action: 'query',
			    list: 'search',
			    srsearch: inCategory + query,
			    srlimit: maxRows
			})
			.done(function(data) {
			    if (data.warnings) {
				console.warn(data.warnings);
			    }

			    data.query.search.forEach(function(result) {
				result.toString = function() {
				    return result.title;
				};
			    });

			    response(data.query.search);
			});

		this.data('lastRequest', request);
	    },

	    cancel: function() {
		if (this.data().lastRequest) {
		    this.data().lastRequest.abort();
		}
		
		this.removeData('lastRequest');
	    },

	    result: {
		render: function(text, context) {
		    var title = new mw.Title(text.title, text.ns);

		    var a = $('<a>')
			    .attr('href', title.getUrl())
			    .attr('title', title.getName())
			    .addClass('mw-searchSuggest-link')
			    .text(title.getName());

		    this.append(a);
		},

		select: function(selected, context) {
		    window.location.assign(
			this.find('a').attr('href')
		    );
		    return false;
		}
	    },

	    special: {
		render: function(query, context) {
		    /*
		     Adds in a special element which takes you to the main search page.
		     */

		    this
			.on('click', function(e) {
			    e.stopPropagation();
			})
			.empty()
			.append(
			    $('<a>')
				.addClass('special-label')
				.attr(
				    'href',
				    queryOnSearchPage(query)
				)
				.text(mw.msg('searchsuggest-containing'))
				.append(
				    $('<div>')
					.addClass('special-query')
					.text(query)
				)
			)
			.show();
		},

		select: function(selected, context) {
		    window.location.assign(
			this.find('a').attr('href')
		    );
		    return false;
		}
	    }
	})
	    .on('cut paste drop focus', function() {
		/*
		 Pretend these events are keypresses, so that they'll trigger search.
		 */
		$(this).trigger('keypress');
	    });
    });
    
}(mediaWiki, jQuery));
