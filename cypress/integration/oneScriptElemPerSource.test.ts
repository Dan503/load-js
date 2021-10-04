import loadJS from "../.."
import { D3JsLibrarySrc, MomentJsLibrarySrc, testHtmlFile } from "../support/commonStuff"

it('Expect to only create a single script element per JS source', () => {
	cy.visit(testHtmlFile).then(() => {
		return Cypress.Promise.all([
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					const $script = document.querySelectorAll(`script.load-js-script[src="${MomentJsLibrarySrc}"]`)
					expect($script.length).to.equal(1)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					const $script = document.querySelectorAll(`script.load-js-script[src="${MomentJsLibrarySrc}"]`)
					expect($script.length).to.equal(1)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(D3JsLibrarySrc, () => {
					const $script = document.querySelectorAll(`script.load-js-script[src="${D3JsLibrarySrc}"]`)
					expect($script.length).to.equal(2)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					const $script = document.querySelectorAll('script.load-js-script')
					expect($script.length).to.equal(2)
					resolve()
				})
			}),
		])
	})
})