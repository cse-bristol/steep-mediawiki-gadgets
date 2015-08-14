"use strict";

/*global mediaWiki, jQuery*/

/*
 This code is intended to reverse the following file: https://github.com/wikimedia/mediawiki/blob/REL1_25/resources/src/mediawiki/mediawiki.toc.js

 Alters the show/hide link on the table of contents.

 Removes the default handler, and replaces it with one which slides left/right instead of up/down and also hides the 'navbar' element.
 */
(function (mw, $) {
    var animationLength = 200;
    
    mw.hook('wikipage.content').add(function (content) {
	var container = $('.container'),
	    toc = content.find('#toc'),
	    tocTitle = toc.find('#toctitle h2'),
	    tocToggleLink = toc.find('#togglelink'),
	    contentDiv = $('#content'),

	    setVisibility = function(show) {
		tocToggleLink.text(
		    mw.msg(
			show ? 'hidetoc' : 'showtoc'
		    )
		);
		
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
		    shouldShow ? null : '1'
		);

		setVisibility(shouldShow);
	    };

	if (tocToggleLink.length) {
	    /*
	     Removes the default handler added by Mediawiki.
	     */
	    tocToggleLink.off('click');

	    /*
	     Add our own alternative handler.
	     */
	    tocToggleLink
		.click(function ( e ) {
		    e.preventDefault();
		    toggle();
		});

	    setVisibility(
		mw.cookie.get('hidetoc') !== '1'
	    );

	    toc.find('ul')
		.css('display', '');
	}
    });

}(mediaWiki, jQuery));
