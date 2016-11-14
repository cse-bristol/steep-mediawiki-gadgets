"use strict";

/*global mediaWiki, jQuery*/

/*
 Adds a toggle button to the right of the left navbar.

 This controls whether the navbar, table of contents, and other clutter are visible or not.
 */
(function (mw, $) {
    var animationLength = 200;
    
    mw.hook('wikipage.content').add(function (content) {
	var toc = content.find('#toc'),
	    contentDiv = $('#content'),
	    
	    container = $('.container'),
	    navbar = container.find('.navbar'),
	    fullScreenToggle = navbar.find('.fullscreen-toggle'),

	    setFullScreen = function(fullScreen) {
		if (fullScreen) {
		    toc.addClass('tochidden');
		    container.removeClass('clutter');
		} else {
		    toc.removeClass('tochidden');
		    container.addClass('clutter');
		}
	    },

	    toggle = function() {
		var shouldExpand = container.hasClass('clutter');

		mw.cookie.set(
		    'hidetoc',
		    shouldExpand ? '1' : '0'
		);

		setFullScreen(shouldExpand);
	    };

	if (fullScreenToggle.length) {
	    /*
	     Some operations (e.g. going into Visual Editor, then saving) re-run this JavaScript without reloading the whole page.

	     As a result, we need to make sure we only end up with one click handler.
	     */
	    fullScreenToggle.off('click');
	    
	    fullScreenToggle
		.on('click', function (e) {
		    e.preventDefault();
		    toggle();
		});
	}
    });

}(mediaWiki, jQuery));
