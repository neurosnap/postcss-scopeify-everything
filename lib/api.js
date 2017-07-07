'use strict';

var postcss = require('postcss');
var safe = require('postcss-safe-parser');
var scopeify = require('./index');
var getMeta = require('./meta');

module.exports = customize;

function customize(opts) {
  opts = opts || {};
  return process.bind(this, opts);
}

function process(opts, css) {
  return {
    sync: scopeifySync.bind(this, opts, css),
    promise: scopeifyPromise.bind(this, opts, css),
  };
}

function scopeifySync(opts, css) {
  var plugins = assemblePlugins(opts);
  var result = postcss(plugins).process(css, { parser: safe });
  return getMeta(result);
}

function scopeifyPromise(opts, css) {
  var plugins = assemblePlugins(opts);
  return new Promise(function promise(resolve, reject) {
    postcss(plugins).process(css, { parser: safe })
      .then(getMeta)
      .then(resolve)
      .catch(reject);
  });
}

function assemblePlugins(opts) {
  var plugins = opts.plugins || [];
  if (!Array.isArray(plugins)) {
    throw new Error('`options.plugins` must be an array of PostCSS plugins');
  }
  plugins.push(scopeify(opts));
  return plugins;
}
