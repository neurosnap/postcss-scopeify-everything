'use strict';

var key = require('./css-key');

module.exports = function getCss(result) {
  return result[key];
};
