'use strict';

/* eslint-disable max-len */
const test = require('tape');
const autoprefixer = require('autoprefixer');
const pse = require('../');

const getCss = pse.getCss;
const scopeifyFn = () => selector => `${selector}_1`;
const scopeify = pse.api({ scopeifyFn });

const defaultExpected = {
  elements: {},
  ids: {},
  classes: {},
  keyframes: {},
};

test('should change body element selector to a scoped class selector', (t) => {
  t.plan(2);
  const css = 'body { background-color: "#fff"; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { body: 'body_1' },
  });
  const expectedCss = '.body_1 { background-color: "#fff"; }';

  scopeify(css).promise()
    .then(result => {
      t.deepEqual(result, expected);
      t.equal(getCss(expectedCss));
    })
    .catch(console.error);
});

test('should change div element selector to a scoped class selector', (t) => {
  t.plan(2);
  const css = 'div { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { div: 'div_1' },
  });
  const expectedCss = '.div_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change .cool class selector to a scoped class selector', (t) => {
  t.plan(2);
  const css = '.cool { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cool: 'cool_1' },
  });
  const expectedCss = '.cool_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change #cool id selector to a scoped id selector', (t) => {
  t.plan(2);
  const css = '#cool { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    ids: { cool: 'cool_1' },
  });
  const expectedCss = '#cool_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change .cool.bro class selectors to a scoped class selectors', (t) => {
  t.plan(2);
  const css = '.cool.bro { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cool: 'cool_1', bro: 'bro_1' },
  });
  const expectedCss = '.cool_1.bro_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change .cool#bro combo selectors to scoped combo selectors', (t) => {
  t.plan(2);
  const css = '.cool#bro { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cool: 'cool_1' },
    ids: { bro: 'bro_1' },
  });
  const expectedCss = '.cool_1#bro_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change div > .bro combo selectors to scoped combo selectors', (t) => {
  t.plan(2);
  const css = 'div > .bro { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { div: 'div_1' },
    classes: { bro: 'bro_1' },
  });
  const expectedCss = '.div_1 > .bro_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change #foo, .bro combo selectors to scoped combo selectors', (t) => {
  t.plan(2);
  const css = '#foo, .bro { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { bro: 'bro_1' },
    ids: { foo: 'foo_1' },
  });
  const expectedCss = '#foo_1, .bro_1 { display: flex; height: 50px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a selector within a media query', (t) => {
  t.plan(2);
  const css = '@media (max-width: 480px) { .foo { color: blue; } }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { foo: 'foo_1' },
  });
  const expectedCss = '@media (max-width: 480px) { .foo_1 { color: blue; } }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a keyframe animation selector', (t) => {
  t.plan(2);
  const css = '@keyframes yolo { 0% { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo 5s infinite; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { foo: 'foo_1' },
    keyframes: { yolo: 'yolo_1' },
  });
  const expectedCss = '@keyframes yolo_1 { 0% { opacity: 0; } 100% { opacity: 1; } } .foo_1 { animation: yolo_1 5s infinite; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify an element with :hover', (t) => {
  t.plan(2);
  const css = 'a:hover { text-decoration: none; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_1' },
  });
  const expectedCss = '.a_1:hover { text-decoration: none; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify animation within a media query', (t) => {
  t.plan(2);
  const css = '@keyframes hover { 0% { opacity: 0.0; } 100% { opacity: 0.5; } } @media (max-width: 480px) { .animation:hover { background: green; } }';
  const expected = Object.assign({}, defaultExpected, {
    keyframes: { hover: 'hover_1' },
    classes: { animation: 'animation_1' },
  });
  const expectedCss = '@keyframes hover_1 { 0% { opacity: 0.0; } 100% { opacity: 0.5; } } @media (max-width: 480px) { .animation_1:hover { background: green; } }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify :not class psuedo selector', (t) => {
  t.plan(2);
  const css = '@media screen and (min-width: 769px) { .foo:not(.bar) { display: flex; } }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { foo: 'foo_1', bar: 'bar_1' },
  });
  const expectedCss = '@media screen and (min-width: 769px) { .foo_1:not(.bar_1) { display: flex; } }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should change div > .bro combo selectors to *only* scoping the class selector', (t) => {
  t.plan(2);
  const css = 'div > .bro { display: flex; height: 50px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { bro: 'bro_1' },
  });
  const expectedCss = 'div > .bro_1 { display: flex; height: 50px; }';
  const opts = { elements: false, ids: false, keyframes: false, scopeifyFn };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify classes only within a media query', (t) => {
  t.plan(2);
  const css = '@keyframes hover { 0% { opacity: 0.0; } 100% { opacity: 0.5; } } @media (max-width: 480px) { .animation:hover { background: green; } }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { animation: 'animation_1' },
  });
  const expectedCss = '@keyframes hover { 0% { opacity: 0.0; } 100% { opacity: 0.5; } } @media (max-width: 480px) { .animation_1:hover { background: green; } }';
  const opts = { elements: false, ids: false, keyframes: false, scopeifyFn };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a keyframe animation selector', (t) => {
  t.plan(2);
  const css = '@keyframes yolo { 0% { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo 5s infinite; }';
  const expected = Object.assign({}, defaultExpected, {
    keyframes: { yolo: 'yolo_1' },
  });
  const expectedCss = '@keyframes yolo_1 { 0% { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo_1 5s infinite; }';
  const opts = { elements: false, ids: false, classes: false, scopeifyFn };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify multiple keyframes without stepping on each other', (t) => {
  t.plan(2);
  const css = '@keyframes yolo { 0%   { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo 5s infinite; } @keyframes yoloYolo { 0%   { opacity: 0; } 100% { opacity: 1; } } .bar { animation: yoloYolo 5s infinite; }';
  const expected = Object.assign({}, defaultExpected, {
    keyframes: { yolo: 'yolo_1', yoloYolo: 'yoloYolo_1' },
    classes: { foo: 'foo_1', bar: 'bar_1' },
  });
  const expectedCss = '@keyframes yolo_1 { 0%   { opacity: 0; } 100% { opacity: 1; } } .foo_1 { animation: yolo_1 5s infinite; } @keyframes yoloYolo_1 { 0%   { opacity: 0; } 100% { opacity: 1; } } .bar_1 { animation: yoloYolo_1 5s infinite; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a class with hyphen', (t) => {
  t.plan(2);
  const css = '.cool-bro { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { 'cool-bro': 'cool-bro_1' },
  });
  const expectedCss = '.cool-bro_1 { display: flex; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a class with number', (t) => {
  t.plan(2);
  const css = '.cool_123 { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cool_123: 'cool_123_1' },
  });
  const expectedCss = '.cool_123_1 { display: flex; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify a class and automatically add vendor prefixes to CSS output', t => {
  t.plan(2);
  const css = '.prefix { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { prefix: 'prefix_1' },
  });
  const expectedCss = '.prefix_1 { display: -webkit-box; display: -ms-flexbox; display: flex; }';
  const opts = { scopeifyFn, plugins: [autoprefixer()] };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should not scopeify anything', (t) => {
  t.plan(2);
  const css = '.cool { display: flex; } div { font-size: 12px; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cool: 'cool' },
    elements: { div: 'div' },
  });
  const expectedCss = '.cool { display: flex; } .div { font-size: 12px; }';
  const opts = { scopeifyFn: () => name => name };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});
