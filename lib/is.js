'use strict';

module.exports = {
  class: isClass,
  id: isId,
  pseudo: isPseudo,
  element: isElement,
  squareClass: isSquareClass,
};

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

function isElement(selector) {
  return !isClass(selector) && !isId(selector) && !isPseudo(selector) && !isSquareClass(selector);
}
