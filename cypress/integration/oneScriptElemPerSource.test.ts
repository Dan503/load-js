import loadJS from "../.."
import { D3JsLibrarySrc, MomentJsLibrarySrc, testHtmlFile } from "../support/commonStuff"

const getScriptCount = (): number => document.querySelectorAll(`script.load-js-script`).length

it('Expect to only create a single script element per JS source', () => {
	cy.visit(testHtmlFile).then(() => {
		expect(getScriptCount()).to.equal(0)
		expect(getScriptCount()).to.equal(0)
		return Cypress.Promise.all([
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					expect(getScriptCount()).to.equal(1)
					resolve()
				})
			}),
			new Cypress.Promise((resolve) => {
				loadJS(MomentJsLibrarySrc, () => {
					expect(getScriptCount()).to.equal(1)
					resolve()
				})
			}),
		]).then(() => {
			return Cypress.Promise.all([
				new Cypress.Promise((resolve) => {
					loadJS(D3JsLibrarySrc, () => {
						expect(getScriptCount()).to.equal(2)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(MomentJsLibrarySrc, () => {
						expect(getScriptCount()).to.equal(2)
						resolve()
					})
				}),
				new Cypress.Promise((resolve) => {
					loadJS(D3JsLibrarySrc, () => {
						expect(getScriptCount()).to.equal(2)
						resolve()
					})
				}),
			])
		})
	})
})
