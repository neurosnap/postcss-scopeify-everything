'use strict';

/* eslint-disable max-len */
const test = require('tape');
const autoprefixer = require('autoprefixer');
const pse = require('./');

const getCss = pse.getCss;
const scopeifyFn = () => selector => `${selector}_1`;
const scopeify = pse.api({ scopeifyFn });

const defaultExpected = {
  elements: {},
  ids: {},
  classes: {},
  keyframes: {},
  fontFaces: {},
};

test('should change body element selector to a scoped class selector', (t) => {
  t.plan(2);
  const css = 'body { background-color: "#fff"; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { body: 'body_el_1' },
  });
  const expectedCss = '.body_el_1 { background-color: "#fff"; }';

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
    elements: { div: 'div_el_1' },
  });
  const expectedCss = '.div_el_1 { display: flex; height: 50px; }';

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
    elements: { div: 'div_el_1' },
    classes: { bro: 'bro_1' },
  });
  const expectedCss = '.div_el_1 > .bro_1 { display: flex; height: 50px; }';

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
    elements: { a: 'a_el_1' },
  });
  const expectedCss = '.a_el_1:hover { text-decoration: none; }';

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
    elements: { div: 'div_el' },
  });
  const expectedCss = '.cool { display: flex; } .div_el { font-size: 12px; }';
  const opts = { scopeifyFn: () => name => name };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify element and class selector', t => {
  t.plan(2);
  const css = 'td.cell { width: 100% !important; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cell: 'cell_1' },
    elements: { td: 'td_el_1' },
  });
  const expectedCss = '.td_el_1.cell_1 { width: 100% !important; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify class with attribute selector `[class=selector]`', t => {
  t.plan(2);
  const css = 'td[class="cell"] { width: 100% !important; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { cell: 'cell_1' },
    elements: { td: 'td_el_1' },
  });
  const expectedCss = '.td_el_1[class~="cell_1"] { width: 100% !important; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify class with attribute selector `[class=selector]` with a class with hyphens', t => {
  t.plan(2);
  const css = 'td[class="cell-area"] { width: 100% !important; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { 'cell-area': 'cell-area_1' },
    elements: { td: 'td_el_1' },
  });
  const expectedCss = '.td_el_1[class~="cell-area_1"] { width: 100% !important; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify class with attribute selector `[class=selector]` with a class with multiple classes', t => {
  t.plan(2);
  const css = 'td[class="cell center"] { width: 100% !important; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { 'cell center': 'cell_center_1' },
    elements: { td: 'td_el_1' },
  });
  const expectedCss = '.td_el_1[class~="cell_center_1"] { width: 100% !important; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should *not* scopeify class with attribute selector `[class=selector]`', t => {
  t.plan(2);
  const css = 'td[class="cell"] { width: 100% !important; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { td: 'td_el_1' },
  });
  const expectedCss = '.td_el_1[class~="cell"] { width: 100% !important; }';
  const opts = { scopeifyFn, classes: false };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify element and class with same selector name', t => {
  t.plan(2);
  const css = 'table[class="table"] { width: 100%; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { table: 'table_el_1' },
    classes: { table: 'table_1' },
  });
  const expectedCss = '.table_el_1[class~="table_1"] { width: 100%; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify font-face at-rule', t => {
  t.plan(2);
  const css = '@font-face { font-family: "Open-Sans"; font-weight: bold; src: url(http://fonts.google.com) format("woff"); mso-font-alt: "Arial"; }';
  const expected = Object.assign({}, defaultExpected, {
    fontFaces: { 'Open-Sans': 'Open-Sans_1' },
  });
  const expectedCss = '@font-face { font-family: "Open-Sans_1"; font-weight: bold; src: url(http://fonts.google.com) format("woff"); mso-font-alt: "Arial"; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should scopeify attribute selector with substring matcher `*=`', t => {
  t.plan(2);
  const css = 'td[class*="cell-nav"] { width: 100%; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { td: 'td_el_1' },
    classes: { 'cell-nav': 'cell-nav_1' },
  });
  const expectedCss = '.td_el_1[class*="cell-nav_1"] { width: 100%; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should *not* scopeify font-face', t => {
  t.plan(2);
  const css = '@font-face { font-family: "Open-Sans"; font-weight: bold; src: url(http://fonts.google.com) format("woff"); mso-font-alt: "Arial"; }';
  const expected = defaultExpected;
  const expectedCss = '@font-face { font-family: "Open-Sans"; font-weight: bold; src: url(http://fonts.google.com) format("woff"); mso-font-alt: "Arial"; }';
  const opts = { scopeifyFn, fontFaces: false };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should properly scope both elements and classes with attribute selector', t => {
  t.plan(2);
  const css = 'span[class="zestimate-break"], span[class="nolinebreak"] { display: none; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { span: 'span_el_1' },
    classes: { 'zestimate-break': 'zestimate-break_1', nolinebreak: 'nolinebreak_1' },
  });
  const expectedCss = '.span_el_1[class~="zestimate-break_1"], .span_el_1[class~="nolinebreak_1"] { display: none; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should properly scope both elements and classes with normal classes', t => {
  t.plan(2);
  const css = 'span.zestimate-break, span.nolinebreak { display: none; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { span: 'span_el_1' },
    classes: { 'zestimate-break': 'zestimate-break_1', nolinebreak: 'nolinebreak_1' },
  });
  const expectedCss = '.span_el_1.zestimate-break_1, .span_el_1.nolinebreak_1 { display: none; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('the `*` selector should be converted to class `__asterisk_1`', t => {
  t.plan(2);
  const css = '* { display: none; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { '*': '__asterisk_1' },
  });
  const expectedCss = '.__asterisk_1 { display: none; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('the `*` selector class attribute selector', t => {
  t.plan(2);
  const css = '*[class~="foo"] { display: none; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { '*': '__asterisk_1' },
    classes: { foo: 'foo_1' },
  });
  const expectedCss = '.__asterisk_1[class~="foo_1"] { display: none; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('element with class attribute selector without quotes', t => {
  t.plan(2);
  const css = 'div[class=show_me_always] { visibility: visible; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { div: 'div_el_1' },
    classes: { show_me_always: 'show_me_always_1' },
  });
  const expectedCss = '.div_el_1[class~=show_me_always_1] { visibility: visible; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('the `*` selector class attribute selector without quotes', t => {
  t.plan(2);
  const css = '*[class=show_me_always] { visibility: visible; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { '*': '__asterisk_1' },
    classes: { show_me_always: 'show_me_always_1' },
  });
  const expectedCss = '.__asterisk_1[class~=show_me_always_1] { visibility: visible; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('element selector with id attribute selector without quotes', t => {
  t.plan(2);
  const css = 'div[id=aapl] { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { div: 'div_el_1' },
    ids: { aapl: 'aapl_1' },
  });
  const expectedCss = '.div_el_1[id=aapl_1] { display: flex; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('element selector with id attribute selector with quotes', t => {
  t.plan(2);
  const css = 'div[id=\'aapl\'] { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { div: 'div_el_1' },
    ids: { aapl: 'aapl_1' },
  });
  const expectedCss = '.div_el_1[id=\'aapl_1\'] { display: flex; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('test combination of elements, attribute selectors, and wildcard selector', t => {
  t.plan(2);
  const css = 'table[id=aapl-eyebrow] a, *[class=aapl-container] a { color: inherit; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1', table: 'table_el_1', '*': '__asterisk_1' },
    ids: { 'aapl-eyebrow': 'aapl-eyebrow_1' },
    classes: { 'aapl-container': 'aapl-container_1' },
  });
  const expectedCss = '.table_el_1[id=aapl-eyebrow_1] .a_el_1, .__asterisk_1[class~=aapl-container_1] .a_el_1 { color: inherit; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('element selector h1', t => {
  t.plan(2);
  const css = 'h1 { font-size: 16px; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { h1: 'h1_el_1' },
  });
  const expectedCss = '.h1_el_1 { font-size: 16px; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should use `__wildcard__` for the asterisk name instead of `__asterisk`', t => {
  t.plan(2);
  const css = '* { display: flex; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { '*': '__wildcard___1' },
  });
  const expectedCss = '.__wildcard___1 { display: flex; }';
  const opts = { scopeifyFn, asteriskName: '__wildcard__' };

  const result = pse.api(opts)(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should fix missing bracket', t => {
  t.plan(2);
  const css = 'a {';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1' },
  });
  const expectedCss = '.a_el_1 {}';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should ignore random `!important` outside of a css declaration', t => {
  t.plan(2);
  const css = 'a { color: blue; !important; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1' },
  });
  const expectedCss = '.a_el_1 { color: blue; !important; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should ignore random `.` outside of a css declaration', t => {
  t.plan(2);
  const css = 'a { color: #3869D4;. }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1' },
  });
  const expectedCss = '.a_el_1 { color: #3869D4;. }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should ignore HTML comments', t => {
  t.plan(2);
  const css = '/* I am an HTML comment */ a { color: blue; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1' },
  });
  const expectedCss = '/* I am an HTML comment */ .a_el_1 { color: blue; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should close the missing bracket', t => {
  t.plan(2);
  const css = '@media only screen and (max-width: 480px) { .img-responsive { color: black; }';
  const expected = Object.assign({}, defaultExpected, {
    classes: { 'img-responsive': 'img-responsive_1' },
  });
  const expectedCss = '@media only screen and (max-width: 480px) { .img-responsive_1 { color: black; }}';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});

test('should ignore a selector without brackets', t => {
  t.plan(2);
  const css = '#yiv6126322310 a { color: red; }';
  const expected = Object.assign({}, defaultExpected, {
    elements: { a: 'a_el_1' },
    ids: { yiv6126322310: 'yiv6126322310_1' },
  });
  const expectedCss = '#yiv6126322310_1 .a_el_1 { color: red; }';

  const result = scopeify(css).sync();
  t.deepEqual(result, expected);
  t.equal(getCss(result), expectedCss);
});
