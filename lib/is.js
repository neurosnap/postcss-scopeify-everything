'use strict';

module.exports = {
  class: isClass,
  id: isId,
  pseudo: isPseudo,
  squareClass: isSquareClass,
  attribute: isAttribute,
  asterisk: isAsterisk,
  element: isElement,
};

const elementRe = new RegExp(/^[a-zA-Z]+$/);

function isClass(selector) {
  return selector.startsWith('.');
}

function isId(selector) {
  return selector.startsWith('#');
}

function isPseudo(selector) {
  return selector.startsWith(':');
}

function isSquareClass(selector) {
  return selector.startsWith('[]');
}

function isAttribute(selector) {
  return isSquareClass(selector);
}

function isAsterisk(selector) {
  return selector === '*';
}

function isElement(selector) {
  return elementRe.test(selector);
}
