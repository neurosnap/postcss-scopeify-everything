'use strict';

const getSelectorType = require('./selector-type');

const isNumberRe = new RegExp(/^\d+/);
const findSelectors = new RegExp(/([\.#][\w\-_]+|\w+|:\w+|\*)/g);
const findAttributeSelectors = new RegExp(
  /(\w+|\*)(\[(class|id)[*^~$|]?=["']?)([\s\w\d\-_]+)(["']?\])\s*(\w*)/gi
);
const findAttrClassEqSelectors = new RegExp(/(\[class=)/gi);
const asteriskName = '__asterisk';

module.exports = scopeifySelectors;

function scopeifySelectors(selectorStr, selectors, message, scopeify, opts) {
  // HACK, replacing all `[class=someClass]` selectors with `[class~=someClass]`
  // exact matches for classes no longer worker because element selectors are being converted into
  // classes.  So `div[class=someClass]` turns into `<div class="div_el_1 someClass_1">`
  selectorStr = selectorStr.replace(findAttrClassEqSelectors, '[class~=');

  for (let j = 0; j < selectors.length; j++) {
    const selector = selectors[j];
    if (isNumberRe.test(selector)) continue;

    const squareSelectors = splitAttributeSelectors(selector);
    let splitSelectors;
    if (squareSelectors.length > 0) {
      splitSelectors = squareSelectors;
    } else {
      splitSelectors = splitComboSelectors(selector);
    }

    for (let i = 0; i < splitSelectors.length; i++) {
      const partialSelector = splitSelectors[i];
      const selectorType = getSelectorType(partialSelector);
      if (selectorType === 'pseudo') continue;
      if (skipSelector(selectorType, opts)) continue;

      let sel;
      let messageType;
      if (selectorType === 'asterisk') {
        sel = getAsteriskSelector(partialSelector);
        messageType = 'elements';
      } else if (selectorType === 'element') {
        sel = getElementSelector(partialSelector, opts.scopeifyElFn);
        messageType = 'elements';
      } else if (selectorType === 'id') {
        sel = getIdSelector(partialSelector);
        messageType = 'ids';
      } else if (selectorType === 'class') {
        sel = getClassSelector(partialSelector);
        messageType = 'classes';
      } else if (selectorType === 'unknown') {
        console.error('`unknown` selector type detected for: ' + partialSelector);
        continue;
      }

      const noPrefixSelector = removeSelectorPrefix(partialSelector);
      const scopedSelector = scopeify(sel.replaceSelectorWith);
      message[messageType][noPrefixSelector] = removeSelectorPrefix(scopedSelector);
      selectorStr = selectorStr.replace(sel.selector, scopedSelector);
    }
  }

  return { selector: selectorStr, message: message };
}

function skipSelector(selectorType, opts) {
  if (selectorType === 'class' && !opts.classes) return true;
  if (selectorType === 'id' && !opts.ids) return true;
  if (selectorType === 'element' && !opts.elements) return true;
  if (selectorType === 'asterisk' && !opts.elements) return true;
  return false;
}

function removeSelectorPrefix(selector) {
  const selectorType = getSelectorType(selector);
  if (selectorType !== 'class' && selectorType !== 'id') return selector;
  return selector.slice(1);
}

function getAsteriskSelector(selector) {
  return { selector: selector, replaceSelectorWith: convertToClass(asteriskName) };
}

function getElementSelector(selector, scopeifyElFn) {
  let replaceSelectorWith = convertToClass(selector);
  replaceSelectorWith = scopeifyElFn(replaceSelectorWith);
  const partialSel = findPartialSelector(selector);
  return { selector: partialSel, replaceSelectorWith: replaceSelectorWith };
}

function getClassSelector(selector) {
  const sel = removeSelectorPrefix(selector);
  const replaceSelectorWith = sel.replace(/\s/g, '_');
  return { selector: findPartialSelector(sel), replaceSelectorWith: replaceSelectorWith };
}

function getIdSelector(selector) {
  const sel = removeSelectorPrefix(selector);
  return { selector: findPartialSelector(sel), replaceSelectorWith: sel };
}

function convertToClass(selector) {
  return '.' + selector;
}

function findPartialSelector(partialSelector) {
  return new RegExp('\\b' + partialSelector + '\\b');
}

function splitAttributeSelectors(selector) {
  let sel;
  const selectors = [];
  while ((sel = findAttributeSelectors.exec(selector)) !== null) {
    selectors.push(sel[1]);

    if (sel[3] === 'id') {
      selectors.push('#' + sel[4]);
    } else if (sel[3] === 'class') {
      selectors.push('.' + sel[4]);
    }

    if (sel[6] !== '') {
      selectors.push(sel[6]);
    }
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
