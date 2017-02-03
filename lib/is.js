'use strict';

module.exports = {
  class: isClass,
  id: isId,
  pseudo: isPseudo,
  asterisk: isAsterisk,
  element: isElement,
};

var elementRe = new RegExp(/^[a-zA-Z0-9]+$/);

function isClass(selector) {
  return selector.startsWith('.');
}

function isId(selector) {
  return selector.startsWith('#');
}

function isPseudo(selector) {
  return selector.startsWith(':');
}

function isAsterisk(selector) {
  return selector === '*';
}

function isElement(selector) {
  return elementRe.test(selector);
}
