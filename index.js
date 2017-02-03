'use strict';

var scopeify = require('./lib');
var api = require('./lib/api');
var getCss = require('./lib/get-css');
var key = require('./lib/css-key');

module.exports = scopeify;
module.exports.api = api;
module.exports.getCss = getCss;
module.exports.key = key;
