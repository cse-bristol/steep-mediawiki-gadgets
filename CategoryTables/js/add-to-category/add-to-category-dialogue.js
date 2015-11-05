"use strict";

/*global mediaWiki, jQuery, OO*/

(function(mw, $, OO) {
    var titleRegex = new RegExp("^[" + mw.config.values.wgLegalTitleChars + "]{1,256}$");

    OO.AddToCategoryDialogue = function() {
	OO.ui.ProcessDialog.call(this, {});
    };

    OO.inheritClass(OO.AddToCategoryDialogue, OO.ui.ProcessDialog);

    OO.AddToCategoryDialogue.prototype.isValidTitle = function(text) {
	return titleRegex.test(text);
    };
    
    OO.AddToCategoryDialogue.prototype.focus = function() {
	throw new Error("Not implemented");
    };

    OO.AddToCategoryDialogue.prototype.setPlaceholder = function(placeholder) {
	this.pageTitle.$element.find('input').attr('placeholder', placeholder);
    };

    OO.AddToCategoryDialogue.prototype.initialize = function() {
	OO.AddToCategoryDialogue.parent.prototype.initialize.apply(this, arguments);

	var dialogue = this;
	
	this.pageTitle = new OO.ui.TextInputWidget({ 
	    validate: this.isValidTitle
	});

	this.pageTitle.on('change', function() {
	    dialogue.checkValidity.call(dialogue);
	});
    };

    OO.AddToCategoryDialogue.prototype.checkValidity = function() {
	var valid = this.isValidTitle(
	    this.pageTitle.getValue()
	);

	this.setCreateAbilities.call(this, valid);	
    };

    OO.AddToCategoryDialogue.prototype.getSetupProcess = function(data) {
	var dialogue = this;
	
	return OO.AddToCategoryDialogue.parent.prototype.getSetupProcess.call(this, data)
	    .next(function() {
    		dialogue.checkValidity.call(dialogue);		
	    });
    };

    /*
     For the any actions which use the title box to create a page, enable or disable them based on its validity.
     */
    OO.AddToCategoryDialogue.prototype.setCreateAbilities = function(titleValid) {
	throw new Error('Not implemented');
    };
   
}(mediaWiki, jQuery, OO));
