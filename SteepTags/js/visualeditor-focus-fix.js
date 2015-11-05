"use strict";

/*global mediaWiki, ve*/

/*
 A partial fix for a bug in VisualEditor for Mediaiwiki 1.25. The editor layer steals focus from some dialogue boxes, which means you can't type in the 'Summary' field of the save dialogue, nor the search box.
 
 This fix sorts out the 'Summary' field, but not the search box.

 See [https://www.mediawiki.org/wiki/Topic:Sikx3284w9gfhw6t] and [https://phabricator.wikimedia.org/T106419].
*/
(function(mw, ve) {
	var wrappedOpen = ve.ui.MWSaveDialog.prototype.getSetupProcess;
	
	ve.ui.MWSaveDialog.prototype.getSetupProcess = function() {
	    var dialogue = this;
	    
	    return wrappedOpen.apply(this, arguments)
		.next(
		    function() {
			this.editSummaryInput.focus();
		    },
		    this
		);
	};

}(mediaWiki, ve));
 
