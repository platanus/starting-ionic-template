exports.config = {
	// The address of a running selenium server.
	seleniumAddress: 'http://localhost:4444/wd/hub',

	// A base URL for your application under test. Calls to protractor.get()
	// with relative paths will be prepended with this.
	baseUrl: 'http://localhost:9000',

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome'
	},

	onPrepare: function() {
		browser.driver.manage().window().setSize(360, 700);
	},

	// Spec patterns are relative to the location of the spec file. They may
	// include glob patterns.
	specs: ['test/specs/*_spec.js'],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true, // Use colors in the command line report.
	}
};
