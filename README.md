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
// Import using one of these 2 methods
import loadJS from '@dan503/load-js' // ES Module import syntax
var loadJS = require('@dan503/load-js').default // Common JS import syntax

// Use the first parameter to point to where the external js file needs to be downloaded from.
loadJS('https://www.website.com/js-file.js', () => {
	// The 2nd parameter is a callback function.
	// The callback will be called once the JS file has finished downloading.
})
```

## Key features

### Call multiple times, only download the file once

It will only ever download the target file **once per page load** even if called multiple times.

### Trigger callback immediately if the file is already downloaded

If the script has already been downloaded, it will trigger the callback function immediately in a synchronous fashion.

### Callbacks retain source order

It will call all of the callbacks in the order that they were declared in when the script has finished loading.

### Super simple syntax

As you can see from the usage example above, the usage syntax is extremely simple and easy to remember.

### Quality assured with Cypress tests

This project uses [Cypress](https://www.cypress.io/) end to end tests to ensure the function does what it is supposed to.

### Supports TypeScript

This function has been written in TypeScript so it has full TypeScript support built in.
