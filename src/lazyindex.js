'use strict';

var BaseIndex = require('./baseindex');
var ArrayEnumerator = require('./enumerators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an lazy-evaluated index for a data frame or column.
 */
var LazyIndex = function (name, valuesFn) {
	assert.isString(name, "Expected 'name' parameter to Index constructor to be a string.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to Index constructor to be a function.");

	var self = this;
	self._name = name;
	self._valuesFn = valuesFn;
};

var parent = inherit(LazyIndex, BaseIndex);

/**
 * Get the name of the index.
 */
LazyIndex.prototype.getName = function () {
	var self = this;
	return self._name;
};

/**
 * Get an enumerator to iterate the values of the index.
 */
LazyIndex.prototype.getEnumerator = function () {
	var self = this;
	return new ArrayEnumerator(self._valuesFn());
};

module.exports = LazyIndex;