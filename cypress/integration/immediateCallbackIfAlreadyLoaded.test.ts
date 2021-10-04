import loadJS from "../..";
import { MomentJsLibrarySrc, testHtmlFile, Window } from "../support/commonStuff";

it('Expect to run callback immediately if the script has already been loaded', () => {
	let calls = 0;
	cy.visit(testHtmlFile).then(() => {
		expect(Window.moment).to.be.undefined
		new Cypress.Promise((resolve) => {
			loadJS(MomentJsLibrarySrc, () => {
				calls++
				expect(calls).to.equal(1)
				resolve()
			})
		}).then(() => {
			expect(Window.moment).to.not.be.undefined
			return new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(2)
					resolve()
				})
				calls++
				expect(calls).to.equal(3)
			})
		})
	})
})
