'use strict';

const key = require('./css-key');

module.exports = meta;

function meta(result) {
  const message = result.messages
    .find(msg => msg.plugin === 'postcss-scopeify-everything');
  const metaData = Object.defineProperty({}, key, { value: result.css });
  if (!message) return metaData;

  metaData.elements = message.elements;
  metaData.classes = message.classes;
  metaData.ids = message.ids;
  metaData.keyframes = message.keyframes;
  metaData.fontFaces = message.fontFaces;
  return metaData;
}
