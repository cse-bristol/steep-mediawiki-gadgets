"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, $, OO) {
    /*
     Used when viewing a 'Category:NameOfCategory' page.
     
     Finds the button #new-category-page and adds click behaviour for it to delegate to one of two dialogues.
     */
    mw.hook('wikipage.content').add(function(content) {
	if (!mw.viewingCategoryPage) {
	    return;
	}

	var newDocumentButton = OO.ui.infuse('new-category-page'),
	    category = mw.config.values.wgTitle || "",
	    isProjectsPage = category === "Projects",
	    windowManager = new OO.ui.WindowManager();
	
	$('body').append(windowManager.$element);

	var dialogue = isProjectsPage ? new mw.NewProjectDialogue() : new mw.AddAssetDialogue();
	dialogue.category = category;
	
	windowManager.addWindows([dialogue]);

	newDocumentButton.on('click', function () {
	    var window = windowManager.openWindow(dialogue)
		    .done(function() {
			dialogue.focus();			
		    });
	});	
    });
    
}(mediaWiki, jQuery, OO));
