import loadJS from "../..";
import { MomentJsLibrarySrc, testHtmlFile } from "../support/commonStuff";

it('Expect to run callback immediately if the script has already been loaded', () => {
	let calls = 0;
	cy.visit(testHtmlFile).then(() => {
		new Cypress.Promise((resolve) => {
			loadJS(MomentJsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(1)
				resolve()
			})
		}).then(() => {
			return new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(2)
					resolve()
				})
			})
		})
	})
})
