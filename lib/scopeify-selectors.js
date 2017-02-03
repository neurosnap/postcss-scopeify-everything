'use strict';

var getSelectorType = require('./selector-type');

var isNumberRe = new RegExp(/^\d+/);
var findSelectors = new RegExp(/([.#][\w\-_]+|\w+|:\w+|\*)/g);
var findAttributeSelectors = new RegExp(
  /(\w+|\*)(\[(class|id)[*^~$|]?=["']?)([\s\w\d\-_]+)(["']?\])\s*(\w*)/gi
);
var findAttrClassEqSelectors = new RegExp(/(\[class=)/gi);
// var asteriskName = '__asterisk';

module.exports = scopeifySelectors;

function scopeifySelectors(selectorStr, selectors, message, scopeify, opts) {
  // HACK, replacing all `[class=someClass]` selectors with `[class~=someClass]`.
  // Exact matches for classes no longer work because element selectors are being converted into
  // classes.  So `div[class=someClass]` turns into `<div class="div_el_1 someClass_1">`.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
  selectorStr = selectorStr.replace(findAttrClassEqSelectors, '[class~=');

  for (var j = 0; j < selectors.length; j++) {
    var selector = selectors[j];
    if (isNumberRe.test(selector)) continue;

    var squareSelectors = splitAttributeSelectors(selector);
    var splitSelectors;
    if (squareSelectors.length > 0) {
      splitSelectors = squareSelectors;
    } else {
      splitSelectors = splitComboSelectors(selector);
    }

    for (var i = 0; i < splitSelectors.length; i++) {
      var partialSelector = splitSelectors[i];
      var selectorType = getSelectorType(partialSelector);
      if (selectorType === 'pseudo') continue;
      if (skipSelector(selectorType, opts)) continue;

      var sel;
      var messageType;
      if (selectorType === 'asterisk') {
        sel = getAsteriskSelector(partialSelector, opts.asteriskName);
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

      var noPrefixSelector = removeSelectorPrefix(partialSelector);
      var scopedSelector = scopeify(sel.replaceSelectorWith);
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
  var selectorType = getSelectorType(selector);
  if (selectorType !== 'class' && selectorType !== 'id') return selector;
  return selector.slice(1);
}

function getAsteriskSelector(selector, asteriskName) {
  if (typeof asteriskName === 'function') {
    asteriskName = asteriskName();
  }

  return { selector: selector, replaceSelectorWith: convertToClass(asteriskName) };
}

function getElementSelector(selector, scopeifyElFn) {
  var replaceSelectorWith = convertToClass(selector);
  replaceSelectorWith = scopeifyElFn(replaceSelectorWith);
  var partialSel = findPartialSelector(selector);
  return { selector: partialSel, replaceSelectorWith: replaceSelectorWith };
}

function getClassSelector(selector) {
  var sel = removeSelectorPrefix(selector);
  var replaceSelectorWith = sel.replace(/\s/g, '_');
  return { selector: findPartialSelector(sel), replaceSelectorWith: replaceSelectorWith };
}

function getIdSelector(selector) {
  var sel = removeSelectorPrefix(selector);
  return { selector: findPartialSelector(sel), replaceSelectorWith: sel };
}

function convertToClass(selector) {
  return '.' + selector;
}

function findPartialSelector(partialSelector) {
  return new RegExp('\\b' + partialSelector + '\\b');
}

function splitAttributeSelectors(selector) {
  var sel;
  var selectors = [];
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
  var sel;
  var selectors = [];
  while ((sel = findSelectors.exec(selector)) !== null) {
    selectors.push(sel[1]);
  }
  return selectors;
}
