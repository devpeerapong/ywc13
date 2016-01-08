// =============== Page Object ================= //

var SigninPage = function () {
	var HttpBackend = require('httpbackend');
	var backend = null;

	var username = element(by.css('input[name="username"]'));
	var password = element(by.css('input[name="password"]'));

    this.get = function () {
        browser.get('/#!/signin');
    };

    this.setUsername = function (user) {
    	username.sendKeys(user);
    };

    this.setPassword = function (pwd) {
    	password.sendKeys(pwd);
    };

    this.clearUsername = function () {
    	username.clear();
    };

    this.clearPassword = function () {
    	password.clear();
    };

    this.getUsernameErrorText = function () {
        return element.all(by.css('.form-group')).first().getText();
    };

    this.getUsernameContainerClass = function () {
        return element.all(by.css('.form-group')).first().getAttribute('class');
    };

    this.getPasswordErrorText = function () {
        return element.all(by.css('.form-group')).get(1).getText();
    };

    this.getPasswordContainerClass = function () {
        return element.all(by.css('.form-group')).get(1).getAttribute('class');
    };

	this.getError = function () {
		return element(by.css('.alert.alert-danger'));
	};

	this.submitForm = function () {
		element(by.css('button.form-control')).click();
	};

	this.setBackend = function () {
		backend = new HttpBackend(browser);
		backend.whenGET(/directives.*/).passThrough();
		backend.whenGET(/views.*/).passThrough();
	};

	this.clearBackend = function () {
		backend.clear();
	};

	this.resetBackend = function () {
		backend.reset();
	};

	this.setSigninRoute = function (type) {
		if(type == 'success') {
			backend.whenPOST('/api/auth/signin').respond(function () {
				var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
				'.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9' +
				'.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM';
				return [200, { token: jwt }];
			});
		} else {
			backend.whenPOST('/api/auth/signin').respond(function () {
				return [401, { message: 'username or password incorrect' }];
			});
		}
		
	};

	this.signout = function () {
		element(by.css('li[uib-dropdown]')).click();
		element(by.css('a[ng-click="NavbarCTRL.signout()"]')).click();
	};
};

// =============== E2E TEST ================= //
describe('SigninPage Page: ', function() {
	var Page = new SigninPage();

	it('should not show any error at first', function() {
		Page.get();
		
		expect(Page.getUsernameErrorText()).toBe('');
		expect(Page.getPasswordErrorText()).toBe('');
		expect(Page.getError().isPresent()).toBeFalsy();
	});

	describe('when guest want to signin', function() {
		describe('not filling form correctly', function() {
			beforeEach(function() {
				Page.get();	
			});

			it('should show required error if submit w/out filling form', function() {
				Page.submitForm();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show required error on username if submit w/ blank username', function() {
				Page.setPassword('awesomepwd');

				Page.submitForm();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
			});

			it('should show required error on password if submit w/ blank password', function() {
				Page.setUsername('awesomeusername');

				Page.submitForm();
				
				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show required error if type then delete', function() {
				Page.setUsername('awesomeusername');
				Page.clearUsername();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');

				Page.setPassword('awesomepwd');
				Page.clearPassword();

				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});
		});

		describe('filling form correctly', function() {
			beforeEach(function() {
				Page.setBackend();
			});

			afterEach(function() {
				Page.clearBackend();
			});

			it('should show error if username or password incorrect', function() {
				Page.setSigninRoute('failed');

				Page.get();
				Page.setUsername('thiswillpass');
				Page.setPassword('thiswillpass');

				Page.submitForm();

				expect(Page.getError().isPresent()).toBeTruthy();
			});

			it('should redirect to /articles if user submit form', function() {
				Page.setSigninRoute('success');

				Page.get();

				Page.setUsername('thiswillpass');
				Page.setPassword('thiswillpass');

				Page.submitForm();

				expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/articles');
			});
		});
	});

	describe('when user want to signin', function() {
		afterAll(function() {
			browser.sleep(3000);
			Page.signout();
		});

		it('should redirect user to /articles', function() {
			Page.get();
			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/articles');
		});
	});
});

