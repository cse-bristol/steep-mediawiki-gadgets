"use strict";

/*global mediaWiki, jQuery*/

/*
 Puts a show/hide link on the table of contents.
 */
(function (mw, $) {
    var animationLength = 200;
    
    mw.hook('wikipage.content').add(function (content) {
	var container = $('.container'),
	    toc = content.find('#table-of-contents'),
	    tocTitle = toc.find('#toctitle'),
	    contentDiv = $('#content'),

	    setVisibility = function(show) {
		if (show) {
		    toc.removeClass('tochidden');
		    container.addClass('clutter');
		    contentDiv.addClass('shrunk');
		} else {
		    toc.addClass('tochidden');
		    container.removeClass('clutter');
		    contentDiv.removeClass('shrunk');
		}
	    },

	    toggle = function() {
		var shouldShow = toc.hasClass('tochidden');
		
		mw.cookie.set(
		    'hidetoc',
		    shouldShow ? 0 : '1'
		);

		setVisibility(shouldShow);
	    };

	if (toc.length) {
	    var tocToggleLink = $('<a>');

	    tocToggleLink.href = '#';

	    tocToggleLink.addClass('toctoggle');

	    /*
	     Add our own alternative handler.
	     */
	    tocToggleLink
		.click(function ( e ) {
		    e.preventDefault();
		    toggle();
		});

	    tocTitle.append(tocToggleLink);
	}
    });

}(mediaWiki, jQuery));
