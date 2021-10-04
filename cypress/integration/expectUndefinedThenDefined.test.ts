import loadJS from "../.."
import { D3JsLibrarySrc, MomentJsLibrarySrc, testHtmlFile, Window } from "../support/commonStuff"

it('Expect all global variables to be undefined at first then defined when running callbacks', () => {
	cy.visit(testHtmlFile).then(() => {
		return Cypress.Promise.all([
			new Cypress.Promise((resolve) => {
				expect('moment not loaded').to.eq('moment not loaded')
				expect(Window.moment).to.be.undefined
				loadJS(MomentJsLibrarySrc, () => {
					// A crude method for marking the moment vs d3 calls
					expect('moment loaded').to.eq('moment loaded')
					expect(Window.moment).to.not.be.undefined
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				expect('d3 not loaded').to.eq('d3 not loaded')
				expect(Window.d3).to.be.undefined
				loadJS(D3JsLibrarySrc, () => {
					expect('d3 loaded').to.eq('d3 loaded')
					expect(Window.d3).to.not.be.undefined
					resolve()
				})
			})
		])
	})
})