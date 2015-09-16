"use strict";

/*global module, require, process*/

var mongoClient = require('mongodb').MongoClient,
    
    elasticClient = require('livedb-elasticsearch')(null, 'share', true),

    collections = [
	'demo',
	'maps',
	'process-models',
	'shape-layers'
    ],

    successes = 0,
    errors = 0,

    nextCollection = function(db) {
	if (collectionsQueue.length) {
	    var next = collectionsQueue.pop();
	    next.f(db, next.coll);
	    
	} else {
	    console.log("MongoDB to ElasticSearch data migration", "successes", successes, "errors", errors);
	    process.exit(0);
	}
    }, 

    traverseCollection = function(db, c, elasticWrite, makeBody) {
	var coll = db.collection(c),
	    cursor = coll.find({}, function(error, cursor) {
		if (error) {
		    console.error("getting collection from mongo failed", c, error);
		    process.exit(1);
		} else {
		    var handleDoc = function(err, doc) {
			if (err) {
			    errors++;
			    
			} else if (doc === null) {
			    nextCollection(db);
			    
			} else {
			    elasticWrite(
				c,
				doc._id,
				makeBody(doc),
				function(error, result) {
				    if (error) {
					console.error(c, doc, error);
					errors++;
				    } else {
					successes++;
				    }

				    cursor.nextObject(handleDoc);
				}
			    );
			}
		    };
		    
		    console.log("starting collection", c);
		    cursor.nextObject(handleDoc);
		}
	    });
    },

    traverseSnapshots = function(db, coll) {
	traverseCollection(
	    db,
	    coll,
	    elasticClient.writeSnapshot,
	    function(snapshot) {
		var body = {
		    v: snapshot._v,
		    type: snapshot._type,
		    data: {}
		};

		Object.keys(snapshot).forEach(function(k) {
		    if (k[0] !== "_") {
			body.data[k] = snapshot[k];
		    }
		});

		return body;

	    }
	);
    },

    traverseOps = function(db, coll) {
	traverseCollection(
	    db,
	    coll,
	    elasticClient.writeOp,
	    function(op) {
		return {
		    v: op._v,
		    src: op.src,
		    seq: op.seq,
		    meta: op.m,
		    op: op.op,
		    create: op.create,
		    del: op.del
		};
	    }
	);
    },

    collectionsQueue = collections
	.map(function(c) {
	    return {
		f: traverseSnapshots,
		coll: c
	    };
	})
	.concat(
	    collections.map(function(c) {
		return {
		    f: traverseOps,
		    coll: c + "_ops"
		};
	    })
	);


console.log("Performing data migration", "connecting to Mongo");
mongoClient.connect('mongodb://localhost:27017/share', function(error, db) {
    if (error) {
	console.error("connecting to mongo failed", error);
	process.exit(1);
    } else {
	console.log("connected to mongo");
    }

    elasticClient.deleteMappings(function(error, result) {
	if (error) {
	    console.error("dropping mappings failed", error);
	    process.exit(1);
	} else {
	    elasticClient.ensureMappingsCreated(function(error, result) {
		if (error) {
		    console.error("creating mappings", error);
		    process.exit(1);
		} else {
		    nextCollection(db);
		}
	    });
	}
    });
});
