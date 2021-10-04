import loadJS from "../.."
import { D3JsLibrarySrc, MomentJsLibrarySrc, testHtmlFile, Window } from "../support/commonStuff"

it('Expect the *delayed* loaded script global variables to be defined', () => {
	cy.visit(testHtmlFile).then(() => {
		return new Cypress.Promise((resolve) => {
			console.log(Window.moment)
			expect(Window.moment).to.be.undefined
			loadJS(MomentJsLibrarySrc, () => {
				expect(Window.moment).to.not.be.undefined
				resolve()
			})
		}).then(() => {
			return new Cypress.Promise((resolve) => {
				expect(Window.d3).to.be.undefined
				loadJS(D3JsLibrarySrc, () => {
					expect(Window.d3).to.not.be.undefined
					resolve()
				})
			})
		})
	})
})