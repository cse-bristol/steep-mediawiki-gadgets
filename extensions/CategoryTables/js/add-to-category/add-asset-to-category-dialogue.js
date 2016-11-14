"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, jQuery, OO) {
    OO.AddAssetToCategoryDialogue = function(category) {
	OO.AddAssetDialogue.call(this, category);
    };

    OO.inheritClass(OO.AddAssetToCategoryDialogue, OO.AddAssetDialogue);

    OO.AddAssetToCategoryDialogue.static.actions = OO.AddAssetDialogue.static.actions.concat([
	{ modes: 'category', action: 'create-category', label: mw.msg('create-category'), flags: ['constructive', 'primary'] },
	{ modes: 'choose', action: 'category', label: mw.msg('sub-category'), flags: 'constructive' }
    ]);

    OO.AddAssetToCategoryDialogue.prototype.setCreateAbilities = function(titleValid) {
	OO.AddAssetToCategoryDialogue.parent.prototype.setCreateAbilities.call(this, titleValid);
	
	this.actions.setAbilities({
	    'create-category': titleValid
	});
    }; 

    OO.AddAssetToCategoryDialogue.prototype.getActionProcess = function(action) {
	var dialogue = this;
	
	switch (action) {
	case 'category':
	    return new OO.ui.Process(function() {
	    dialogue.switchCreateMode.call(dialogue, 'category');
		return true;
	    });
	    
	case 'create-category':
	    return new OO.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds.category,
		[dialogue.category]
	    );
	    
	    
	    default:
	    return OO.AddAssetDialogue.prototype.getActionProcess.call(this, action);
	}
    };
    
}(mediaWiki, jQuery, OO));
