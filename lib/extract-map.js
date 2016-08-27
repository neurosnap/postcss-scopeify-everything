'use strict';

const is = require('./is');

const isClass = is.class;
const isId = is.id;
const isPseudo = is.pseudo;
const isSquareClass = is.squareClass;

module.exports = extractMap;

function extractMap(selectors, message, scopeFn) {
  for (let i = 0; i < selectors.length; i++) {
    const partialSelector = selectors[i];
    if (isPseudo(partialSelector)) continue;
    const selectorName = removeSelectorPrefix(partialSelector);
    const scopedName = scopeFn(selectorName);

    if (isClass(partialSelector)) {
      message.classes[selectorName] = scopedName;
    } else if (isSquareClass(partialSelector)) {
      message.classes[selectorName] = scopedName;
    } else if (isId(partialSelector)) {
      message.ids[selectorName] = scopedName;
    } else {
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
