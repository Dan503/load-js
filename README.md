# load-js

A small function for loading a js file before running code. It will only ever load the file once per page load even if called multiple times.

## Install

```
npm i @dan503/load-js
```

## Usage

```js
var loadJS = require('@dan503/load-js')

loadJS('https://www.website.com/js-file.js', () => {
	// code to run after the JS file has finished loading
})
```
