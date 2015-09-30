"use strict";

/*global mediaWiki, jQuery, OO, steep*/

(function(mw, $, OO, steep) {
    var titleRegex = new RegExp("^[" + mw.config.values.wgLegalTitleChars + "]{1,256}$");

    steep.AddToCategoryDialogue = function() {
	OO.ui.ProcessDialog.call(this, {});
    };

    OO.inheritClass(steep.AddToCategoryDialogue, OO.ui.ProcessDialog);

    steep.AddToCategoryDialogue.prototype.isValidTitle = function(text) {
	return titleRegex.test(text);
    };
    
    steep.AddToCategoryDialogue.prototype.focus = function() {
	throw new Error("Not implemented");
    };

    steep.AddToCategoryDialogue.prototype.setPlaceholder = function(placeholder) {
	this.pageTitle.$element.find('input').attr('placeholder', placeholder);
    };

    steep.AddToCategoryDialogue.prototype.initialize = function() {
	steep.AddToCategoryDialogue.parent.prototype.initialize.apply(this, arguments);

	var dialogue = this;
	
	this.pageTitle = new OO.ui.TextInputWidget({ 
	    validate: this.isValidTitle
	});

	this.pageTitle.on('change', function() {
	    dialogue.checkValidity.call(dialogue);
	});
    };

    steep.AddToCategoryDialogue.prototype.checkValidity = function() {
	var valid = this.isValidTitle(
	    this.pageTitle.getValue()
	);

	this.setCreateAbilities.call(this, valid);	
    };

    steep.AddToCategoryDialogue.prototype.getSetupProcess = function(data) {
	var dialogue = this;
	
	return steep.AddToCategoryDialogue.parent.prototype.getSetupProcess.call(this, data)
	    .next(function() {
    		dialogue.checkValidity.call(dialogue);		
	    });
    };

    /*
     For the any actions which use the title box to create a page, enable or disable them based on its validity.
     */
    steep.AddToCategoryDialogue.prototype.setCreateAbilities = function(titleValid) {
	throw new Error('Not implemented');
    };
   
}(mediaWiki, jQuery, OO, steep));
