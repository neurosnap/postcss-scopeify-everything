'use strict';

var key = require('./css-key');

module.exports = meta;

function meta(result) {
  var message = result.messages
    .find(function findPluginName(msg) {
      return msg.plugin === 'postcss-scopeify-everything';
    });
  var metaData = Object.defineProperty({}, key, { value: result.css });
  if (!message) return metaData;

  metaData.elements = message.elements;
  metaData.classes = message.classes;
  metaData.ids = message.ids;
  metaData.keyframes = message.keyframes;
  metaData.fontFaces = message.fontFaces;
  return metaData;
}
