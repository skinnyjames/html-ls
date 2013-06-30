html-ls
===

[![Build Status](https://travis-ci.org/jarofghosts/html-ls.png?branch=master)](https://travis-ci.org/jarofghosts/html-ls)

html-ls makes a pretty directory list (ul) in html!

## usage

````js
var htmlls = require('html-ls');

htmlls('/var/www').pipe(process.stdout);
````

## options

Optionally, you can pass `true` as the second argument to hide dotfiles.

## license

MIT
