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
			return new Cypress.Promise((resolve) => {
				loadJS(jsLibrarySrc, () => {
					expect(window.moment).to.exist
					resolve()
				})
			})
		})
	})

	it('Expect to only create a single script element per JS source', () => {
		cy.visit('./cypress/fixtures/test.html').then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						const $script = document.querySelectorAll(`script.load-js-script[src="${jsLibrarySrc}"]`)
						expect($script.length).to.equal(1)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(altJsLibrarySrc, () => {
						const $script = document.querySelectorAll(`script.load-js-script[src="${altJsLibrarySrc}"]`)
						expect($script.length).to.equal(1)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						const $script = document.querySelectorAll('script.load-js-script')
						expect($script.length).to.equal(2)
						resolve()
					})
				}),
			])
		})
	})

	it('Expect to run all callbacks', () => {
		let calls = 0;
		cy.visit('./cypress/fixtures/test.html').then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						calls++
						expect(calls).to.equal(1)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						calls++
						expect(calls).to.equal(2)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						calls++
						expect(calls).to.equal(3)
						resolve()
					})
				}),
			])
		})
	})

	it('Expect to run callback immediately if the script has already been loaded', () => {
		let calls = 0;
		cy.visit('./cypress/fixtures/test.html').then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						calls++
						expect(calls).to.equal(1)
						resolve()
					})
				}),
				cy.wait(1000).then(() => {
					new Cypress.Promise((resolve) => {
						loadJS(jsLibrarySrc, () => {
							calls++
							expect(calls).to.equal(2)
							resolve()
						})
					})
				})
			])
		})
	})
})
