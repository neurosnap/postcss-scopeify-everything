'use strict';

const is = require('./is');

const isClass = is.class;
const isId = is.id;
const isPseudo = is.pseudo;
const isSquareClass = is.squareClass;

module.exports = extractMap;

function extractMap(selectors, message, scopeifyFn, scopeifyElFn) {
  for (let i = 0; i < selectors.length; i++) {
    const partialSelector = selectors[i];
    if (isPseudo(partialSelector)) continue;
    const selectorName = removeSelectorPrefix(partialSelector);

    if (isClass(partialSelector)) {
      const scopedName = scopeifyFn(selectorName);
      message.classes[selectorName] = scopedName;
    } else if (isSquareClass(partialSelector)) {
      const scopedName = scopeifyFn(selectorName);
      message.classes[selectorName] = scopedName.replace(/\s/g, '_');
    } else if (isId(partialSelector)) {
      const scopedName = scopeifyFn(selectorName);
      message.ids[selectorName] = scopedName;
    } else {
      const scopedName = scopeifyFn(scopeifyElFn(selectorName));
      message.elements[selectorName] = scopedName;
    }
  }

  return message;
}

function removeSelectorPrefix(selector) {
  if (isSquareClass(selector)) return selector.slice(2);
  if (!isClass(selector) && !isId(selector)) return selector;
  return selector.slice(1);
}
