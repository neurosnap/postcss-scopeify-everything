const postcss = require('postcss');
const scopeify = require('./index');
const getMeta = require('./meta');

module.exports = customize;

function customize(opts) {
  return process.bind(this, opts);
}

function process(opts, css) {
  return {
    sync: scopeifySync.bind(this, opts, css),
    promise: scopeifyPromise.bind(this, opts, css),
  };
}

function scopeifySync(opts, css) {
  const plugins = assemblePlugins(opts);
  const result = postcss(plugins).process(css);
  return getMeta(result);
}

function scopeifyPromise(opts, css) {
  const plugins = assemblePlugins(opts);
  return new Promise(function promise(resolve, reject) {
    postcss(plugins).process(css)
      .then(getMeta)
      .then(resolve)
      .catch(reject);
  });
}

function assemblePlugins(opts) {
  const plugins = opts.plugins || [];
  if (!Array.isArray(plugins)) {
    throw new Error('`options.plugins` must be an array of PostCSS plugins');
  }
  plugins.push(scopeify(opts));
  return plugins;
}
