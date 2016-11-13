'use strict';

var babelRelayPlugin = require('babel-relay-plugin');
var schema = require('../data/schema');

module.exports = babelRelayPlugin(schema.data);