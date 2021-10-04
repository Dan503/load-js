describe('Each test must be run separately!', () => {
	it('Due to the way the tests interact with the window object and how load-js relies on a global scope variable for tracking scripts, each test must be run separately (one at a time) for the results to be valid.', () => {
		// I want this test to intentionally fail so that it draws attention to the message
		expect(true).to.eq(false)
	})
})
