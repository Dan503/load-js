/// <reference types="Cypress" />
import loadJS from '../../index'

// Using moment.js for testing since it is a large JS library
const jsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.js'
//D3 is also a large JS source file
const altJsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.js'

describe('load JS tests', () => {
	it('Expect to not exist then to exist', () => {
		cy.visit('./cypress/fixtures/test.html').then(() => {
			expect(window.moment).to.not.exist
			loadJS(jsLibrarySrc, () => {
				expect(window.moment).to.exist
			})
		})
	})

	it('Expect to only create a single script element per JS source', () => {
		cy.visit('./cypress/fixtures/test.html').then(() => {
			loadJS(jsLibrarySrc, () => {
				const $script = document.querySelectorAll(`script.load-js-script[src="${jsLibrarySrc}"]`)
				expect($script.length).to.equal(1)
			})
			loadJS(altJsLibrarySrc, () => {
				const $script = document.querySelectorAll(`script.load-js-script[src="${altJsLibrarySrc}"]`)
				expect($script.length).to.equal(1)
			})
			loadJS(jsLibrarySrc, () => {
				const $script = document.querySelectorAll('script.load-js-script')
				expect($script.length).to.equal(2)
			})
		})
	})

	it('Expect to run all callbacks', () => {
		let calls = 0;
		cy.visit('./cypress/fixtures/test.html').then(() => {
			loadJS(jsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(1)
			})
			loadJS(jsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(2)
			})
			loadJS(jsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(3)
			})
		})
	})

	it('Expect to run callback immediately if script previously loaded', () => {
		let calls = 0;
		cy.visit('./cypress/fixtures/test.html').then(() => {
			loadJS(jsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(1)
			})
			setTimeout(() => {
				loadJS(jsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(2)
				})
			}, 1000)
		})
	})
})
