html-ls
===

[![Build Status](https://travis-ci.org/jarofghosts/html-ls.png?branch=master)](https://travis-ci.org/jarofghosts/html-ls)

html-ls makes a pretty directory list (`<ul>`) in html!

## usage

````js
var htmlls = require('html-ls');

htmlls('/var/www').pipe(process.stdout)
````

## options

the optional second argument can contain an options object looking something
like this (with defaults noted):

```js
{
  hideDot: false,
  showUp: false
}
```

`hideDot` will block the rendering of dotfiles, and `showUp` determines whether
or not to show an entry for '..'

## license

MIT
