# load-js

A small function for loading a js file before running code.

This function is ideal for loading up something like a polyfill before running code that is dependant on that polyfill.

## Install

Install using [npm](https://www.npmjs.com/) which comes bundled with [Node.js](https://nodejs.org/en/).

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

## Key features

### Call multiple times, only download the file once

It will only ever download the target file **once per page load** even if called multiple times.

### Trigger callback immediately if the file is already downloaded

If the script has already been downloaded, it will trigger the callback function immediately in a synchronous fashion.

### Callbacks retain source order

It will call all of the callbacks in the order that they were declared when the script has finished loading.

### Super simple syntax

As you can see from the usage example above, the usage syntax is extremely simple and easy to remember.
