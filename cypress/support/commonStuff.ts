/// <reference types="Cypress" />

// Using moment.js for testing since it is a large JS library
export const MomentJsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.js'
//D3 is also a large JS source file
export const D3JsLibrarySrc = 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.js'

export const testHtmlFile = './cypress/fixtures/test.html'

export const Window = window as (
	typeof window & {
		moment: any
		d3: any
	}
)
