"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, $, OO) {
    OO.AddAssetToProjectDialogue = function(category) {
	OO.AddAssetDialogue.call(this, category);
    };

    OO.inheritClass(OO.AddAssetToProjectDialogue, OO.AddAssetDialogue);

    OO.AddAssetToProjectDialogue.static.actions = OO.AddAssetDialogue.static.actions.concat([
    	{ modes: 'project', action: 'create-project', label: 'Create Sub-Project', flags: ['constructive', 'primary'] },
    	{ modes: 'choose', action: 'project', label: 'Sub-Project', flags: 'constructive' },
    ]);

    OO.AddAssetToProjectDialogue.prototype.setCreateAbilities = function(titleValid) {
	OO.AddAssetToProjectDialogue.parent.prototype.setCreateAbilities.call(this, titleValid);
	
	this.actions.setAbilities({
	    'create-project': titleValid
	});
    }; 

    OO.AddAssetToProjectDialogue.prototype.getActionProcess = function (action) {
	var dialogue = this;

	switch(action) {
	case 'project':
	    return new OO.ui.Process(function() {
		dialogue.switchCreateMode.call(dialogue, 'project');
		return true;
	    });

	case 'create-project':
	    return new OO.AddToCategoryProcess(
		dialogue.pageTitle.getValue(),
		mw.config.values.wgNamespaceIds.category,
		[dialogue.category, 'ProjectsAndSubProjects']
	    );
	    
	default:
	    return OO.AddAssetDialogue.prototype.getActionProcess.call(dialogue, action);
	}
    };
    
}(mediaWiki, jQuery, OO));
