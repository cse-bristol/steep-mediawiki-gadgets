"use strict";

/*global OO*/

(function(OO) {
    /*
     Fixes a bug when editing a document in VisualEditor. If there was a substantial amount of text, then clicking at the bottom would cause the page to scroll to the top and vice-versa.

     This occurs because OO.ui.Element.static.scrollIntoView gets called twice when you click here: once with where your cursor was previously, and then again with where you clicked. 
     Of these two calls, the first call triggers an animation back to where you cursor was. The second does nothing.

     This doesn't occur in the Vector skin because it uses the <html> element instead of the <body> element as its scroll container - presumably just breaking the scrolling behaviour entirely. The function below replicates this.

     The calls don't happen at all in more recent versions of Mediawiki, which makes me thing that it's ok to break them for now.
     */
    OO.ui.Element.static.getRootScrollableElement = function (el) {
	return el.ownerDocument["documentElement"];
    };
}(OO));
