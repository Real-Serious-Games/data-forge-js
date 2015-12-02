'use strict';

//
// Implements mongodb data source.
//

module.exports = function (config) {

	var fs = require('fs');
	var assert = require('chai').assert;
	var E = require('linq');

	assert.isObject(config, "Expected 'config' parameter to 'mongo data source' to be an object.");
	assert.isString(config.db, "Expected 'config.db' parameter to 'mongo data source' to be a string.");
	assert.isString(config.collection, "Expected 'config.collection' parameter to 'mongo data source' to be a string.");

	var pmongo = require('promised-mongo');
	var host = config.host || 'localhost';
	var connectionString = host + '/' + config.db;
	var query = config.query || {};
	var fields = config.fields || {};

	return {

		//
		// Write to mongodb.
		//	
		read: function () {

			var db = pmongo(connectionString, [config.collection]);
			return db[config.collection]
				.find(query, fields)
				.toArray()
				.then(function (docs) {
					db.close();
					return docs;
				});
		},
		
		//
		// Read from monogdb.
		//
		write: function (documents) {
			assert.isArray(documents, "Expected 'documents' parameter to 'mongo.write' to be an array.");

			var db = pmongo(connectionString, [config.collection]);
			return E.from(documents)
				.aggregate(Promise.resolve(), function (prevSavePromise, document) {
					return prevSavePromise.then(function () {
						return db[config.collection].save(document);
					});
				})
				.then(function () {
					db.close();
				});
		},
	};
};
	
