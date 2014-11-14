describe('Application ', function() {

  it('should redirects to root', function() {
    // Load root page
    browser.get('/');
    // check redirection
    expect(browser.getCurrentUrl()).toMatch('/home');
  });

});
