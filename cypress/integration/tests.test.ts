/// <reference types="Cypress" />
import loadJS from '../../index'

// Using moment.js for testing since it is a large JS library
const jsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.js'
//D3 is also a large JS source file
const altJsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.js'

const testHtmlFile = './cypress/fixtures/test.html'

const Window = window as (
	typeof window & {
		moment: any
		d3: any
	}
)

const reset = () => {
	Window.moment = undefined
	Window.d3 = undefined
}

describe('load JS tests', () => {
	it('Expect to not exist then to exist', () => {
		cy.visit(testHtmlFile).then(() => {
			expect(Window.moment).to.not.exist
			return new Cypress.Promise((resolve) => {
				loadJS(jsLibrarySrc, () => {
					expect(Window.moment).to.exist
					resolve()
				})
			}).then(reset)
		})
	})

	it('Expect to only create a single script element per JS source', () => {
		cy.visit(testHtmlFile).then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					loadJS(jsLibrarySrc, () => {
						const $script = document.querySelectorAll(`script.load-js-script[src="${jsLibrarySrc}"]`)
						expect($script.length).to.equal(1)
						resolve()
					})
				}),
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
			]).then(reset)
		})
	})

	it('Expect to run all callbacks', () => {
		let calls = 0;
		cy.visit(testHtmlFile).then(() => {
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
				.then(reset)
		})
	})

	// it('Expect to run callback immediately if the script has already been loaded', () => {
	// 	let calls = 0;
	// 	cy.visit(testHtmlFile).then(() => {
	// 		new Cypress.Promise((resolve) => {
	// 			loadJS(jsLibrarySrc, () => {
	// 				calls++
	// 				expect(calls).to.equal(1)
	// 				resolve()
	// 			})
	// 		}).then(() => {
	// 			return new Cypress.Promise((resolve) => {
	// 				loadJS(jsLibrarySrc, () => {
	// 					calls++
	// 					expect(calls).to.equal(2)
	// 					resolve()
	// 				})
	// 			})
	// 		}).then(reset)
	// 	})
	// })

	it('Expect all global variables to be defined when running callbacks', () => {
		cy.visit(testHtmlFile).then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					expect(Window.moment).to.be.undefined
					expect(Window.d3).to.be.undefined
					loadJS(jsLibrarySrc, () => {
						// A crude method for marking the moment vs d3 calls
						expect('moment').to.eq('moment')
						expect(Window.moment).to.not.be.undefined
						expect(Window.d3).to.not.be.undefined
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					expect(Window.moment).to.be.undefined
					expect(Window.d3).to.be.undefined
					loadJS(altJsLibrarySrc, () => {
						expect('d3').to.eq('d3')
						expect(Window.moment).to.not.be.undefined
						expect(Window.d3).to.not.be.undefined
						resolve()
					})
				})
			]).then(reset)
		})
	})

	// it('Expect the *delayed* loaded script global variables to be defined', () => {
	// 	cy.visit(testHtmlFile).then(() => {
	// 		return new Cypress.Promise((resolve) => {
	// 			console.log(Window.moment)
	// 			expect(Window.moment).to.be.undefined
	// 			loadJS(jsLibrarySrc, () => {
	// 				expect(Window.moment).to.not.be.undefined
	// 				resolve()
	// 			})
	// 		}).then(() => {
	// 			return new Cypress.Promise((resolve) => {
	// 				expect(Window.d3).to.be.undefined
	// 				loadJS(altJsLibrarySrc, () => {
	// 					expect(Window.d3).to.not.be.undefined
	// 					resolve()
	// 				})
	// 			})
	// 		}).then(reset)
	// 	})
	// })
})
