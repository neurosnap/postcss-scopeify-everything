'use strict';

const extractMap = require('./extract-map');
const is = require('./is');

const isClass = is.class;
const isId = is.id;
const isPseudo = is.pseudo;
const isElement = is.element;
const isNumberRe = new RegExp(/^\d+/);
const findSelectors = new RegExp(/([\.#][\w-_]+|\w+|:\w+)/g);

module.exports = scopeifySelectors;

function scopeifySelectors(selectorStr, selectors, message, scopeify, opts) {
  for (let j = 0; j < selectors.length; j++) {
    const selector = selectors[j];
    if (isNumberRe.test(selector)) continue;

    const comboSelectors = splitComboSelectors(selector)
      .filter(function filterOptions(partialSelector) {
        return !isPseudo(partialSelector)
          && ((opts.classes && isClass(partialSelector))
          || (opts.ids && isId(partialSelector))
          || (opts.elements && isElement(partialSelector)));
      });

    selectorStr = comboSelectors.reduce(function selStr(acc, partialSelector) {
      const sel = isElement(partialSelector) ? convertToClass(partialSelector) : partialSelector;
      return acc.replace(partialSelector, scopeify(sel));
    }, selectorStr);

    message = extractMap(comboSelectors, message, scopeify);
  }

  return { selector: selectorStr, message: message };
}

function convertToClass(selector) {
  return '.' + selector;
}

function splitComboSelectors(selector) {
  let sel;
  const selectors = [];
  while ((sel = findSelectors.exec(selector)) !== null) {
    selectors.push(sel[1]);
  }
  return selectors;
}
