"use strict";

/*global mediaWiki, jQuery, OO, steep*/

(function(mw, $, OO, steep) {
    var projectsPage = 'Projects';
    
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
	    isProjectsPage = category === projectsPage,
	    isAProject = !isProjectsPage && mw.config.values.wgCategories.indexOf(projectsPage) >= 0,
	    windowManager = new OO.ui.WindowManager();
	
	$('body').append(windowManager.$element);

	var dialogue = isProjectsPage ? new steep.NewProjectDialogue(category) : (
	    isAProject ? new steep.AddAssetToProjectDialogue(category) :
		new steep.AddAssetToCategoryDialogue(category)
	);
	
	windowManager.addWindows([dialogue]);

	newDocumentButton.on('click', function () {
	    var window = windowManager.openWindow(dialogue)
		    .done(function() {
			dialogue.focus();			
		    });
	});	
    });
    
}(mediaWiki, jQuery, OO, steep));
