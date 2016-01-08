var ArticlesPage = function ArticlesPage() {
	var HttpBackend = require('httpbackend');
	var backend = null;

	this.get = function () {
		browser.get('/#!/article/create');
	};

	this.setTitle = function (title) {
		element(by.css('input[name="title"]')).sendKeys(title);
	};

	this.setContent = function (content) {
		element(by.css('textarea[name="content"]')).sendKeys(content);
	};

	this.getTitleContainerClass = function () {
		return element.all(by.css('.form-group')).first().getAttribute('class');
	};

	this.getContentContainerClass = function () {
		return element.all(by.css('.form-group')).get(1).getAttribute('class');
	};

	this.clickToastr = function() {
		return element(by.css('.toastr')).click();
	};

	this.submitForm = function () {
		element(by.css('button[type="submit"]')).click();
	};

	this.setBackend = function () {
		backend = new HttpBackend(browser);
		backend.whenGET(/directives.*/).passThrough();
		backend.whenGET(/views.*/).passThrough();
	};

	this.setRoute = function () {
		var article = {
			_id: 'asdfasdfasdf1234',
			title: 'testitle',
			content: 'testcontent',
			author: {
				username: 'testusername'
			},
			createdAt: new Date()
		};
		backend.whenPOST('/api/articles').respond(article);
		backend.whenGET(/api/).respond(article);
	};

	this.clearBackend = function () {
		backend.clear();
	};

	this.signin = function () {
		backend.whenPOST('/api/auth/signin').respond(function () {
				var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
				'.eyJ1c2VybmFtZSI6ImF1dGhvcjAifQ' +
				'.urEq-5fStXzGGXzABNNmTMfYMdLfKRs0J9_PKUCpx5I';

				return [200, { token: jwt }];
			});

		browser.get('/#!/signin');

		element(by.css('input[name="username"]')).sendKeys('author0');
		element(by.css('input[name="password"]')).sendKeys('author0');

		element(by.css('button.btn')).click();
	};

	this.signout = function () {
		element(by.css('li[uib-dropdown]')).click();
		element(by.css('a[ng-click="NavbarCTRL.signout()"]')).click();
	};
};

describe('Create Article Page: ', function() {
	var Page = new ArticlesPage();

	it('should redirect user to 403 auth if user is not signin', function() {
		Page.get();

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	describe('when user is signin', function() {
		beforeAll(function() {
			Page.setBackend();
			Page.setRoute();
			Page.signin();
		});

		it('should show error if submit form with title or content field empty', function() {
			Page.get();
			Page.submitForm();

			expect(Page.getTitleContainerClass()).toContain('has-error');
			expect(Page.getContentContainerClass()).toContain('has-error');
		});

		it('should redirect to article if create success', function() {
			Page.get();
			Page.setTitle('test');
			Page.setContent('test');

			Page.submitForm();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/article/asdfasdfasdf1234');
		});

		afterAll(function() {
			browser.sleep(5500);
s			Page.signout();
			Page.clearBackend();
		});
	});

	
});