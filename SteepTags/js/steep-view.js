"use strict";

/*global mediaWiki, ve, OO, jQuery, steep*/

(function(mw, ve, OO, $, steepVE){

    steepVE.view.Steep = function(model, config) {
	if (!config) {
	    throw new Error("No config specified");
	}
	
	ve.ce.LeafNode.call(this, model, config);

	if (!config.toolUrl) {
	    throw new Error("Config must specify a toolUrl property.");
	} else {
	    this.toolUrl = config.toolUrl;
	}

	if (!config.collection) {
	    throw new Error("Config must specifc a collection property.");
	}

	var view = this,
	    modelAttributes = model.getElement().attributes;

	this.$element = $('<div/>')
	    .addClass('steep-node')
            .attr('typeof', model.getElement().type)
	    .attr('contenteditable', false)
	    .css("overflow", "hidden");

	this.$tools = $('<div/>')
	    .addClass('steep-view-tools');

	this.setViewpoint = new OO.ui.ButtonInputWidget({
	    label: mw.message('steeptags-set-viewpoint').text(),
	    id: 'steep-set-viewpoint'
	});
	
	this.setViewpoint.on('click', function(e) {
	    view.$frame[0].contentWindow.postMessage('getViewpoint', window.location.origin);
	});
	/*
	 Listen for messages coming from the iframe with a viewpoint component in them.
	 */
	$(window).on('message', this.receiveViewpoint.bind(this));

	this.history = new steepVE.VersionPicker({
	    label: mw.message('steeptags-history').text(),
	    id: 'steep-history',
	    collection: config.collection
	});

	this.history.loadVersions(modelAttributes.name, modelAttributes.v);
	this.history.on('change', function(e) {
	    var newV = view.history.getValue();

	    if (newV === view.model.getElement().attributes.v) {
		// No change
		return;
	    }

	    view.root.getSurface().getModel().change(
		ve.dm.Transaction.newFromAttributeChanges(
		    view.model.getDocument(),
		    view.getOffset(),
		    {
			v: newV
		    }
		)
	    );
	});

	this.popout = new OO.ui.ButtonInputWidget({
	    label: mw.message('steeptags-popout').text(),
	    id: 'steep-popout'
	});
	this.popout.on('click', function(e) {
	    window.open(
		view.buildSrc(),
		'_blank'
	    );
	});
	

	this.$tools.append(this.setViewpoint.$element);
	this.$tools.append(this.history.$element);
	this.$tools.append(this.popout.$element);

	this.$frame = $('<iframe/>')
	    .attr('src', this.buildSrc());	

	if (modelAttributes.width) {
	    this.$frame.css("width", modelAttributes.width);
	}

	if (modelAttributes.height) {
	    this.$frame.css("height", modelAttributes.height);
	}

	this.$element.append(this.$tools);
	this.$element.append(this.$frame);

	model.on('update', this.update.bind(this));
    };

    OO.inheritClass(steepVE.view.Steep, ve.ce.LeafNode);

    steepVE.view.Steep.prototype.update = function() {
	this.history.setValue(
	    this.model.getElement().attributes.v
	);

	this.$frame
	    .attr('src', this.buildSrc());
    };

    steepVE.view.Steep.prototype.receiveViewpoint = function(e) {
	var source = e.source || e.originalEvent.source;

	if (source === this.$frame[0].contentWindow) {
	    var data = (e.originalEvent && e.originalEvent.data) || e.data;	    
	    
	    if (data && data.viewpoint) {
		if (typeof(data.viewpoint) !== 'string') {
		    throw new Error("Viewpoint must be a string, was: " + typeof(data.viewpoint));
		}
		
		if (data.viewpoint === this.model.getElement().attributes.viewpoint) {
		    // No change
		    return;
		}

		this.root.getSurface().getModel().change(
		    ve.dm.Transaction.newFromAttributeChanges(
			this.model.getDocument(),
			this.getOffset(),
			{
			    viewpoint: data.viewpoint
			}
		    )
		);
	    }
	}
    };

    steepVE.view.Steep.prototype.buildSrc = function() {
	var modelAttributes = this.model.getElement().attributes;
	
	var url = "/" + this.toolUrl + "/?name=" + encodeURIComponent(modelAttributes.name),
	    args = {};

	args.v = modelAttributes.v;
	args.viewpoint = modelAttributes.viewpoint;

	Object.keys(args).forEach(function(k) {
	    var val = args[k];

	    if (val === null || val === undefined || val === "") {
		// No-op
	    } else {
		url += "&" + k + "=" + encodeURIComponent(val);
	    }
	});
	
	return url;
    };

}(mediaWiki, ve, OO, jQuery, steep.ve));
