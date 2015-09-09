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

    todo = {},
    successes = 0,
    errors = 0,

    triggerEnd = function(coll, docName) {
	delete todo[coll][docName];
	if (!Object.keys(todo[coll]).length) {
	    delete todo[coll];
	}
	if (!Object.keys(todo).length) {
	    console.log("MongoDB to ElasticSearch data migration", "successes", successes, "errors", errors);
	    process.exit(0);
	};
    };

console.log("Performing data migration", "connecting to Mongo";
mongoClient.connect('mongodb://localhost:27017/share', function(error, db) {
    if (error) {
	console.erorr("failed connecting to mongo", error);
	process.exit(1);
    }
    
    elasticClient.deleteMappings(function(error, result) {
	if (error) {
	    console.error("dropping mappings", error);
	    process.exit(1);
	} else {
	    elasticClient.ensureMappingsCreated(function(error, result) {
		if (error) {
		    console.error("creating mappings", error);
		    process.exit(1);
		} else {
		    collections.forEach(function(c) {
			var snapshots = db.collection(c),
			    opsName = c + "_ops",
			    ops = db.collection(opsName);

			todo[c] = {};
			todo[opsName] = {};

			snapshots.find({}).toArray(function(error, docs) {
			    docs.forEach(function(snapshot) {
				todo[c][snapshot._id] = true;

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
				
				elasticClient.writeSnapshot(
				    c,
				    snapshot._id,
				    body,
				    function(error, result) {
					if (error) {
					    console.error(c, snapshot, error);
					    errors++;
					} else {
					    successes++;
					}
					triggerEnd(c, snapshot._id);
				    }
				); 
			    });
			});
			
			ops.find({}).toArray(function(error, docs) {
			    docs.forEach(function(op) {
				todo[opsName][op._id] = true;

				elasticClient.writeOp(
				    opsName,
				    op._id,
				    {
					v: op._v,
					src: op.src,
					seq: op.seq,
					meta: op.m,
					op: op.op,
					create: op.create,
					del: op.del
				    },
				    function(error, result) {
					if (error) {
					    console.error(opsName, op, error);
					    errors++;
					} else {
					    successes++;
					}
					triggerEnd(opsName, op._id);
				    }
				);
			    });
			});
		    });
		}
	    });
	}
    });
});


