'use strict';

const postcss = require('postcss');
const defaultScopeifyFn = require('./scopeify-fn');
const scopeifySelectors = require('./scopeify-selectors');

module.exports = postcss.plugin('scopeify', function scopeify(opts) {
  opts = opts || {};
  opts.scopeifyFn = opts.scopeifyFn || defaultScopeifyFn;
  opts.classes = typeof opts.classes === 'boolean' ? opts.classes : true;
  opts.ids = typeof opts.ids === 'boolean' ? opts.ids : true;
  opts.elements = typeof opts.elements === 'boolean' ? opts.elements : true;
  opts.keyframes = typeof opts.keyframes === 'boolean' ? opts.keyframes : true;

  let message = {
    type: 'scopeify',
    plugin: 'postcss-scopeify-everything',
    elements: {},
    classes: {},
    ids: {},
    keyframes: {},
  };

  return function postcssPlugin(css, result) {
    const scopeifyFn = opts.scopeifyFn(css.source.input.css);

    css.walkRules(function walkRules(node) {
      const scopified = scopeifySelectors(node.selector, node.selectors, message, scopeifyFn, opts);
      node.selector = scopified.selector;
      message = scopified.message;
    });

    if (opts.keyframes) {
      css.walkAtRules(function walkAtRules(node) {
        if (node.name !== 'keyframes') return;

        const params = scopeifyFn(node.params);
        message.keyframes[node.params] = params;
        node.params = params;
      });

      css.walkDecls(/^animation/, function walkDecls(decl) {
        Object
          .keys(message.keyframes)
          .forEach(function keyframeKeys(keyframe) {
            const re = new RegExp('^' + keyframe + '\\b');
            decl.value = decl.value.replace(re, message.keyframes[keyframe]);
          });
      });
    }

    result.messages.push(message);
  };
});
