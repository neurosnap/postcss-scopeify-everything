Changelog
=========

0.7.1 (07-07-2017)
------------------

Added safe parser support for async

0.2.0 (01-07-2017)
------------------

* :sparkles: Added dependency [postcss-safe-parser](https://github.com/postcss/postcss-safe-parser)
which creates a more fault tolerant CSS parser.  So now when postcss parsers a CSS syntax error,
it will try to fix it before throwing an error.

0.1.2
-----

* :rocket: Added id attribute selector support, e.g. `div[id="foobar"]`
* :rocket: Added `asteriskName` to options which will allow ability to customize the wildcard scoped name
* :bug: We have to convert all class attribute selectors `[class="someClass"]` into `[class~="someClass"]`
because we are almost always adding more classes to the element which breaks the `class=` rule.  Most
of the time the CSS works with `class~=` which is the same as `.someClass {}` it's just that people
are confused about the syntax.
* :bug: h1, h2, h3, etc. were not getting recognized by the type selector algorithm
* :bug: Passing nothing into the api would crash the library
* :bug: Mixing both attribute selectors and normal element selectors would cause the library to
ignore the element selectors

0.1.1
-----

* :rocket: Added asterisk `*` selector support, which will convert an asterisk into a class
* :bug: Some attribute class selectors with hyphen were not being scopeified properly

0.1.0
-----

* :rocket: Added `font-face` scopeify support
* :bug: Now properly scopeifing class selectors `div[class="selector"]`

0.0.2
-----

* BUGFIX: strict mode for `let` and `const` on older versions of node

0.0.1
-----

* Initial release
