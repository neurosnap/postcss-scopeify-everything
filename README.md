PostCSS Scopeify Everything [![Build Status](https://travis-ci.org/neurosnap/postcss-scopeify-everything.svg?branch=master)](https://travis-ci.org/neurosnap/postcss-scopeify-everything)
===========================

This PostCSS plugin will scopeify every selector, not just classes.

* Converts HTML elements into classes
* Classes
* Ids
* Keyframes
* Font Faces

Use as a plugin
---------------

```js
const postcss = require('postcss');
const scopeify = require('postcss-scopeify-everything');
const opts = {};

postcss([ scopeify(opts) ])
  .process(css)
  .then(result => { console.log(result); });
```

Use in javascript
-----------------

This will return an object with the following properties:

* css {string, hidden use `getCss` access}: the raw scopeified CSS
* elements {object}: map containing all the HTML element scopeified and converted into classes
* classes {object}: map containing all the class selectors scopeified
* ids {object}: map containing all the id selectors scopeified
* keyframes {object}: map containing all the \@keyframe animations that were scopeified
* fontFaces {object}: map containing all the \@font-face definitions that were scopeified

Async
```js
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api();
const getCss = pse.getCss;

const css = 'div > .bro { display: flex; height: 50px; }';

scopeify(css).promise()
  .then(result => {
    console.log(result);
    /* { elements: { div: 'div_4wb1Hi' },
      classes: { bro: 'bro_4wb1Hi' },
      ids: {},
      keyframes: {} }
    */
    console.log(getCss(result));
    // .div_4wb1Hi > .bro_4wb1Hi { display: flex; height: 50px; }
  });
```

Sync
```js
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api();
const getCss = pse.getCss;

const css = '#foo, .bro { display: flex; height: 50px; }';

const scopified = scopeify(css).sync();
console.log(scopified);
/* { elements: {},
  classes: { bro: 'bro_4uC3yI' },
  ids: { foo: 'foo_4uC3yI' },
  keyframes: {} }
*/
console.log(getCss(scopified));
// #foo_4uC3yI, .bro_4uC3yI { display: flex; height: 50px; }
```

Only scopeify classes

```js
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api({ ids: false, keyframes: false, elements: false });
const getCss = pse.getCss;

const scopeified = scopeify(css).sync();
console.log(scopeified);
console.log(getCss(scopeified));
```

Modify scope hash

```js
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api({ scopeifyFn: hashFn });
const getCss = pse.getCss;

const scopeified = scopeify(css).sync();
console.log(scopeified);
console.log(getCss(scopeified));

function hashFn(css) {
  return scopedName(name) {
    return name + '_' + Math.round(+new Date()/1000);
  }
}
```

Add PostCSS plugins

```js
const autoprefixer = require('autoprefixer');
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api({ plugins: [autoprefixer()] });
const getCss = pse.getCss;

const css = '.prefix { display: flex; }';
const scopeified = scopeify(css).sync();
console.log(scopeified);
/* { elements: {},
  classes: { prefix: 'prefix_gQhnX' },
  ids: {},
  keyframes: {} }
*/
console.log(getCss(scopeified));
// .prefix_gQhnX { display: -webkit-box; display: -ms-flexbox; display: flex; }
```

No scope

```js
const pse = require('postcss-scopeify-everything');
const scopeify = pse.api({ scopeifyFn: () => name => name });
const getCss = pse.getCss;

const css = '.cool { display: flex; } div { font-size: 12px; }';
const scopeified = scopeify(css).sync();
console.log(scopeified);
/* { elements: { div: 'div' },
  classes: { cool: 'cool' },
  ids: {},
  keyframes: {} }
*/
console.log(getCss(scopeified));
// .cool { display: flex; } .div { font-size: 12px; }
```

Options
-------

* plugins (Array): adds PostCSS plugins before the scopeify plugin
* scopeifyFn (Function): the function that hashes the identifier name
* ids (Boolean): determines whether or not to disable scoping `ids`
* elements (Boolean): determines whether or not to disable scoping `elements`
* classes (Boolean): determines whether or not to disable scoping `classes`
* keyframes (Boolean): determines whether or not to disable scoping `keyframes`
* fontFaces (Boolean): determines whether or not to disable scoping `fontFaces`
