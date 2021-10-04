import loadJS from "../..";
import { MomentJsLibrarySrc, testHtmlFile, Window } from "../support/commonStuff";

it('Testing loop works as expected', () => {
	let callNumber = 0;
	cy.visit(testHtmlFile).then(() => {
		const expectations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

		return Cypress.Promise.all(expectations.map((number) => {
			return new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					expect(callNumber).to.equal(number)
					callNumber++
					resolve()
				})
			})
		}))
	})
})
