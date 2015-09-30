"use strict";

/*global mediaWiki, jQuery, OO, steep*/

(function(mw, jQuery, OO, steep) {
    steep.AddAssetToCategoryDialogue = function(category) {
	steep.AddAssetDialogue.call(this, category);
    };

    OO.inheritClass(steep.AddAssetToCategoryDialogue, steep.AddAssetDialogue);

    steep.AddAssetToCategoryDialogue.static.actions = steep.AddAssetDialogue.static.actions.concat([
	{ modes: 'category', action: 'create-category', label: 'Create Category', flags: ['constructive', 'primary'] },
	{ modes: 'choose', action: 'category', label: 'Sub-Category', flags: 'constructive' }
    ]);

    steep.AddAssetToCategoryDialogue.prototype.setCreateAbilities = function(titleValid) {
	steep.AddAssetToCategoryDialogue.parent.prototype.setCreateAbilities.call(this, titleValid);
	
	this.actions.setAbilities({
	    'create-category': titleValid
	});
    }; 

    steep.AddAssetToCategoryDialogue.prototype.getActionProcess = function(action) {
	var dialogue = this;
	
	switch (action) {
	case 'category':
	    return new OO.ui.Process(function() {
	    dialogue.switchCreateMode.call(dialogue, 'category');
		return true;
	    });
	    
	case 'create-category':
	    return new steep.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds.category,
		[dialogue.category]
	    );
	    
	    
	    default:
	    return steep.AddAssetDialogue.prototype.getActionProcess.call(this, action);
	}
    };
    
}(mediaWiki, jQuery, OO, steep));
