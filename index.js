 'use strict';

const scopeify = require('./lib');
const api = require('./lib/api');
const getCss = require('./lib/get-css');
const key = require('./lib/css-key');

module.exports = scopeify;
module.exports.api = api;
module.exports.getCss = getCss;
module.exports.key = key;
