const is = require('./is');

module.exports = getSelectorType;

function getSelectorType(selector) {
  if (is.asterisk(selector)) {
    return 'asterisk';
  }

  if (is.class(selector)) {
    return 'class';
  }

  if (is.id(selector)) {
    return 'id';
  }

  if (is.pseudo(selector)) {
    return 'pseudo';
  }

  if (is.attribute(selector)) {
    return 'attribute';
  }

  if (is.element(selector)) {
    return 'element';
  }

  return 'unknown';
}
