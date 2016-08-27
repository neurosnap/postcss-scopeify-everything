'use strict';

const extractMap = require('./extract-map');
const is = require('./is');

const isClass = is.class;
const isId = is.id;
const isPseudo = is.pseudo;
const isElement = is.element;
const isSquareClass = is.squareClass;
const isNumberRe = new RegExp(/^\d+/);
const findSelectors = new RegExp(/([\.#][\w-_]+|\w+|:\w+)/g);
const findSquareClassSelectors = new RegExp(/(\w+)\[class=["|'](\w+)/g);

module.exports = scopeifySelectors;

function scopeifySelectors(selectorStr, selectors, message, scopeify, opts) {
  for (let j = 0; j < selectors.length; j++) {
    const selector = selectors[j];
    if (isNumberRe.test(selector)) continue;

    const squareSelectors = splitSquareSelectors(selector);
    let splitSelectors;
    if (squareSelectors.length > 0) {
      splitSelectors = squareSelectors;
    } else {
      splitSelectors = splitComboSelectors(selector);
    }

    const comboSelectors = splitSelectors
      .filter(function filterOptions(partialSelector) {
        return !isPseudo(partialSelector)
          && ((opts.classes && isClass(partialSelector))
          || (opts.classes && isSquareClass(partialSelector))
          || (opts.ids && isId(partialSelector))
          || (opts.elements && isElement(partialSelector)));
      });

    selectorStr = comboSelectors.reduce(function selStr(acc, partialSelector) {
      const isSquare = isSquareClass(partialSelector);
      const isEl = isElement(partialSelector);
      let sel = partialSelector;
      if (isEl && !isSquare) {
        sel = convertToClass(partialSelector);
      } else if (isSquare) {
        sel = partialSelector.slice(2);
        partialSelector = sel;
      }

      return acc.replace(partialSelector, scopeify(sel));
    }, selectorStr);

    message = extractMap(comboSelectors, message, scopeify);
  }

  return { selector: selectorStr, message: message };
}

function convertToClass(selector) {
  return '.' + selector;
}

function splitSquareSelectors(selector) {
  let sel;
  const selectors = [];
  while ((sel = findSquareClassSelectors.exec(selector)) !== null) {
    selectors.push(sel[1], '[]' + sel[2]);
  }
  return selectors;
}

function splitComboSelectors(selector) {
  let sel;
  const selectors = [];
  while ((sel = findSelectors.exec(selector)) !== null) {
    selectors.push(sel[1]);
  }
  return selectors;
}
