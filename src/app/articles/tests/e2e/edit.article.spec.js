var EditArticlePage = function EditArticlePage() {
	var HttpBackend = require('httpbackend');
	var backend = null;

	this.get = function () {
		browser.get('/#!/articles');
	};

	this.getEditPage = function () {
		browser.get('/#!/article/1/edit');
	};

	this.setTitle = function (title) {
		element(by.css('input[name="title"]')).sendKeys(title);
	};

	this.setContent = function (content) {
		element(by.css('textarea[name="content"]')).sendKeys(content);
	};

	this.clearInput = function () {
		element(by.css('input[name="title"]')).clear();
		element(by.css('textarea[name="content"]')).clear();
	}

	this.clickToastr = function() {
		return element(by.css('.toastr')).click();
	};

	this.getTitle = function () {
		return element(by.css('input[name="title"]')).getAttribute('value');
	};

	this.getContent = function () {
		return element(by.css('textarea[name="content"]')).getAttribute('value');
	};

	this.getToast = function () {
		return element(by.css('.toast'));
	};

	this.getArticleList = function () {
		return element.all(by.css('li.list-group-item'));
	};

	this.getEditAndRemoveButton = function (number) {
		return element.all(by.css('li.list-group-item')).get(number).element(by.css('.btn-group-vertical'));
	};

	this.getArticleTitle = function (number) {
		return element.all(by.css('h4 a')).get(number);
	};

	this.getArticleContent = function (number) {
		return element.all(by.css('.col-md-11 p')).get(number);
	};

	this.getArticleAuthorAndDate = function (number) {
		return element.all(by.css('.col-md-11 small')).get(number);
	};

	this.getTitleContainerClass = function () {
		return element.all(by.css('.form-group')).first().getAttribute('class');
	};

	this.getContentContainerClass = function () {
		return element.all(by.css('.form-group')).get(1).getAttribute('class');
	};

	this.setBackend = function () {
		backend = new HttpBackend(browser);
		backend.whenGET(/directives.*/).passThrough();
		backend.whenGET(/views.*/).passThrough();
	};

	this.clearBackend = function () {
		backend.clear();
	};

	this.setArticlesRoute = function (amount) {
		var _articles = [];
		for (var i = 0; i < amount; i++) {
			var _article = {
				_id: i,
				title: 'article title ' + i,
				content: 'article content ' + i,
				author: { username : 'author' + i },
				createdAt: new Date('2015-'+ (i + 1) + '-23 11:11:11')
			};
			_articles.push(_article);
			backend.whenGET('/api/article/' + i).respond(_article);
		};
		backend.whenGET('/api/articles').respond(_articles);
	};

	this.setEditRoutes = function () {
		var article = {
			_id: 0,
			title: 'article title 0',
			content: 'article content 0',
			author: { username : 'author0' },
			createdAt: new Date('2015-1-23 11:11:11')
		};

		backend.whenGET('/api/article/0').respond(article);
		backend.whenPUT('/api/article/0').respond(article);
	};

	this.edit = function (number) {
		element.all(by.css('li.list-group-item')).get(number).element(by.css('.btn-group-vertical .fa.fa-pencil')).click();
	}

	this.submitForm = function () {
		element(by.css('button[type="submit"]')).click();
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

describe('Edit articles Page: ', function() {
	var Page = new EditArticlePage();

	describe('when users enter the page', function() {
		beforeAll(function() {
			Page.setBackend();
			Page.setArticlesRoute(3);
			Page.setEditRoutes();
			Page.signin()
		});

		it('should redirect to 403 if user not authorized', function() {
			Page.getEditPage();

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
		});

		it('should redirect to edit article page', function() {
			Page.get();
			Page.edit(2);

			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/article/0/edit');
		});

		it('should show article data', function() {
			expect(Page.getTitle()).toEqual('article title 0');
			expect(Page.getContent()).toEqual('article content 0');
		});

		it('should show error if submit form with title or content field empty', function() {
			Page.clearInput();
			Page.submitForm();

			expect(Page.getTitleContainerClass()).toContain('has-error');
			expect(Page.getContentContainerClass()).toContain('has-error');
		});

		it('should redirect to article if edit success', function() {
			Page.setTitle('change');
			Page.setContent('change');
			Page.submitForm();
		});

		it('should show toast if edit success', function() {
			expect(Page.getToast().isPresent()).toBeTruthy();
		});

		afterAll(function() {
			browser.sleep(5500);
			Page.signout();

			Page.clearBackend();
		});
	});

});