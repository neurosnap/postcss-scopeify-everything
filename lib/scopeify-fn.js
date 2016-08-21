'use strict';

module.exports = function scopeify(src) {
  const suffix = encode(hash(src));

  return function scopedName(name) {
    return name + '_' + suffix;
  };
};

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */
function hash(str) {
  let hashStr = 5381;
  let i = str.length;

  while (i) {
    hashStr = (hashStr * 33) ^ str.charCodeAt(--i);
  }
  return hashStr >>> 0;
}

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encode(integer) {
  if (integer === 0) return '0';

  let str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
}
