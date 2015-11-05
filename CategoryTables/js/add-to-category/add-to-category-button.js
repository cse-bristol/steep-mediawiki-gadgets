"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, $, OO) {
    OO.addToCategory = {};
    OO.addToCategory.dialogueConstructor = OO.AddAssetToCategoryDialogue;
    
    /*
     Used when viewing a 'Category:NameOfCategory' page.
     
     Finds the button #new-category-page and adds click behaviour for it to delegate to one of two dialogues.
     */
    mw.hook('wikipage.content').add(function(content) {
	if ($('#new-category-page').length === 0) {
	    /*
	     There's no button for us to set up.
	     */
	    return;
	}

	var newDocumentButton = OO.ui.infuse('new-category-page'),
	    category = mw.config.values.wgTitle || "",
	    windowManager = new OO.ui.WindowManager();
	
	$('body').append(windowManager.$element);

	newDocumentButton.on('click', function () {
	    if (!OO.addToCategory.dialogue) {
		OO.addToCategory.dialogue = new OO.addToCategory.dialogueConstructor(category);
		windowManager.addWindows([OO.addToCategory.dialogue]);
	    }
	    
	    var window = windowManager.openWindow(OO.addToCategory.dialogue)
		    .done(function() {
			OO.addToCategory.dialogue.focus();
		    });
	});	
    });
    
}(mediaWiki, jQuery, OO));
