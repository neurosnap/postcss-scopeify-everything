'use strict';

var postcss = require('postcss');
var defaultScopeifyFn = require('./scopeify-fn');
var defaultScopeifyElFn = require('./scopeify-el-fn');
var defaultAsteriskNameFn = require('./asterisk-fn');
var scopeifySelectors = require('./scopeify-selectors');

module.exports = postcss.plugin('scopeify', function scopeify(opts) {
  opts = opts || {};
  opts.scopeifyFn = opts.scopeifyFn || defaultScopeifyFn;
  opts.scopeifyElFn = opts.scopeifyElFn || defaultScopeifyElFn;
  opts.asteriskName = opts.asteriskName || defaultAsteriskNameFn;
  opts.classes = typeof opts.classes === 'boolean' ? opts.classes : true;
  opts.ids = typeof opts.ids === 'boolean' ? opts.ids : true;
  opts.elements = typeof opts.elements === 'boolean' ? opts.elements : true;
  opts.keyframes = typeof opts.keyframes === 'boolean' ? opts.keyframes : true;
  opts.fontFaces = typeof opts.fontFaces === 'boolean' ? opts.fontFaces : true;

  var message = {
    type: 'scopeify',
    plugin: 'postcss-scopeify-everything',
    elements: {},
    classes: {},
    ids: {},
    keyframes: {},
    fontFaces: {},
  };

  return function postcssPlugin(css, result) {
    var scopeifyFn = opts.scopeifyFn(css.source.input.css);

    css.walkRules(function walkRules(node) {
      var scopified = scopeifySelectors(node.selector, node.selectors, message, scopeifyFn, opts);
      node.selector = scopified.selector;
      message = scopified.message;
    });

    if (opts.keyframes) {
      css.walkAtRules('keyframes', function walkAtRules(node) {
        var params = scopeifyFn(node.params);
        message.keyframes[node.params] = params;
        node.params = params;
      });

      css.walkDecls(/^animation/, function walkDecls(decl) {
        Object
          .keys(message.keyframes)
          .forEach(function keyframeKeys(keyframe) {
            var re = new RegExp('^' + keyframe + '\\b');
            decl.value = decl.value.replace(re, message.keyframes[keyframe]);
          });
      });
    }

    if (opts.fontFaces) {
      css.walkAtRules('font-face', function walkAtRules(node) {
        node.walkDecls('font-family', function walkDecls(decl) {
          var noQuotes = decl.value.replace(/['"]/g, '');
          var val = scopeifyFn(noQuotes);
          message.fontFaces[noQuotes] = val;
          decl.value = decl.value.replace(noQuotes, val);
        });
      });
    }

    result.messages.push(message);
  };
});
