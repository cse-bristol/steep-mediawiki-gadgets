"use strict";

/*global mediaWiki, jQuery, OO, steep*/

(function(mw, $, OO, steep) {
    steep.AddAssetToProjectDialogue = function(category) {
	steep.AddAssetDialogue.call(this, category);
    };

    OO.inheritClass(steep.AddAssetToProjectDialogue, steep.AddAssetDialogue);

    steep.AddAssetToProjectDialogue.static.actions = steep.AddAssetDialogue.static.actions.concat([
    	{ modes: 'project', action: 'create-project', label: 'Create Sub-Project', flags: ['constructive', 'primary'] },
    	{ modes: 'choose', action: 'project', label: 'Sub-Project', flags: 'constructive' },
    ]);

    steep.AddAssetToProjectDialogue.prototype.setCreateAbilities = function(titleValid) {
	steep.AddAssetToProjectDialogue.parent.prototype.setCreateAbilities.call(this, titleValid);
	
	this.actions.setAbilities({
	    'create-project': titleValid
	});
    }; 

    steep.AddAssetToProjectDialogue.prototype.getActionProcess = function (action) {
	var dialogue = this;

	switch(action) {
	case 'project':
	    return new OO.ui.Process(function() {
		dialogue.switchCreateMode.call(dialogue, 'project');
		return true;
	    });

	case 'create-project':
	    return new steep.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds.category,
		[dialogue.category, 'Projects']
	    );
	    
	default:
	    return steep.AddAssetDialogue.prototype.getActionProcess.call(dialogue, action);
	}
    };
    
    
}(mediaWiki, jQuery, OO, steep));
