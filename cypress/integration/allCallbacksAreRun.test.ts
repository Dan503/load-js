import loadJS from '../../index'
import { MomentJsLibrarySrc, testHtmlFile } from "../support/commonStuff";

it('Expect to run all callbacks', () => {
	let calls = 0;
	cy.visit(testHtmlFile).then(() => {
		return Cypress.Promise.all([
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(1)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(2)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					calls++
					expect(calls).to.equal(3)
					resolve()
				})
			}),
		])
	})
})
