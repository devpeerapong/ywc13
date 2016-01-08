// =============== Page Object ================= //

var RegisterPage = function () {
	var HttpBackend = require('httpbackend');
	var backend = null;

	var username = element(by.css('input[name="username"]'));
	var password = element(by.css('input[name="password"]'));

    this.get = function () {
        browser.get('/#!/register');
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

	this.getUsernameVerifyState = function () {
		return element.all(by.css('.fa')).get(1).getAttribute('class');
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

	this.setVerifyRoute = function (type) {
		if (type === 'success') {
			backend.whenPOST('/api/auth/verify').respond({ message: 'Username approved' });
			
		} else {
			backend.whenPOST('/api/auth/verify').respond(function () {
				return [401, ''];
			});
		}
	};

	this.setSigninRoute = function () {
		backend.whenPOST('/api/auth/register').respond(function () {
			var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
			'.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9' +
			'.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM';
			return [200, { token: jwt }];
		});
	};

	this.syncBackend = function () {
		backend.sync();
	};

	this.signout = function () {
		element(by.css('li[uib-dropdown]')).click();
		element(by.css('a[ng-click="NavbarCTRL.signout()"]')).click();
	};
};

// =============== E2E TEST ================= //
describe('Register Page: ', function() {
	var Page = new RegisterPage();

	it('should not show any error at first', function() {
		Page.get();

		expect(Page.getUsernameErrorText()).toBe('');
		expect(Page.getPasswordErrorText()).toBe('');
		expect(Page.getUsernameVerifyState()).toMatch('fa');
	});

	describe('when guest want to register', function() {
		describe('not filling form correctly', function() {
			beforeEach(function() {
				Page.setBackend();
			});

			afterEach(function() {
				Page.clearBackend();
			});

			it('should show required error if submit w/out filling form', function() {
				Page.get();
				Page.submitForm();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show required error on username if submit w/ blank username', function() {
				Page.get();
				Page.setPassword('awesomepwd');

				Page.submitForm();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
			});

			it('should show required error on password if submit w/ blank password', function() {
				Page.get();
				Page.setUsername('awesomeusername');

				Page.submitForm();
				
				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show required error if type then delete', function() {
				Page.get();
				Page.setUsername('awesomeusername');
				Page.clearUsername();

				expect(Page.getUsernameErrorText()).toBe('Username is required');
				expect(Page.getUsernameContainerClass()).toContain('has-error');

				Page.setPassword('awesomepwd');
				Page.clearPassword();

				expect(Page.getPasswordErrorText()).toBe('Password is required');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show min/maxlength error if field is not between 4 - 12 chars', function() {
				Page.get();
				Page.setUsername('u');
				expect(Page.getUsernameErrorText()).toBe('Username must be between 4 - 12 character');
				expect(Page.getUsernameContainerClass()).toContain('has-error');

				Page.setUsername('sernameisawesomebuttoolong');
				expect(Page.getUsernameErrorText()).toBe('Username must be between 4 - 12 character');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
				
				Page.setPassword('pwd');
				expect(Page.getPasswordErrorText()).toBe('Password must be between 4 - 12 character');
				expect(Page.getPasswordContainerClass()).toContain('has-error');

				Page.setPassword('awesomepwdbuttoolong');
				expect(Page.getPasswordErrorText()).toBe('Password must be between 4 - 12 character');
				expect(Page.getPasswordContainerClass()).toContain('has-error');
			});

			it('should show pattern error if field is not match require pattern', function() {
				Page.get();
				Page.setUsername('!@#$%^&*');
				expect(Page.getUsernameErrorText()).toBe('Username must only contain lowercase letter or number');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
			
				Page.clearUsername();
				Page.setUsername('dis not good');
				expect(Page.getUsernameErrorText()).toBe('Username must only contain lowercase letter or number');
				expect(Page.getUsernameContainerClass()).toContain('has-error');

				Page.clearUsername();
				Page.setUsername('thisTOO');
				expect(Page.getUsernameErrorText()).toBe('Username must only contain lowercase letter or number');
				expect(Page.getUsernameContainerClass()).toContain('has-error');


				Page.setPassword('dis not good');
				expect(Page.getPasswordErrorText()).toBe('Password must not contain space');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
			});

			it('should show verify error if username is already taken', function() {
				Page.setVerifyRoute('error');
				Page.get();

				Page.setUsername('alreadyused');
				expect(Page.getUsernameErrorText()).toBe('Username is already taken');
				expect(Page.getUsernameVerifyState()).toContain('fa-remove');
				expect(Page.getUsernameContainerClass()).toContain('has-error');
			});
		});

		describe('filling form correctly', function() {
			beforeAll(function() {
				Page.setBackend();		
				Page.setSigninRoute();
				Page.setVerifyRoute('success');
			});

			beforeEach(function() {
				Page.get();
			})

			afterAll(function() {
				Page.clearBackend();
			});

			it('should show success if username is ready to use', function() {

				Page.setUsername('thiswillpass');

				expect(Page.getUsernameErrorText()).toBe('');
				expect(Page.getUsernameContainerClass()).toContain('has-success');
				expect(Page.getUsernameVerifyState()).toContain('fa-check');
			});

			it('should redirect to /articles if user submit form', function() {

				Page.setUsername('thiswillpass');
				Page.setPassword('thiswillpass');

				Page.submitForm();

				expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/articles');
			});
		});
	});

	describe('when user want to register', function() {
		it('should redirect user to /articles', function() {
			Page.get();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/articles');
		});

		afterAll(function() {
			browser.sleep(3000);
			Page.signout();
		});
	});
});

