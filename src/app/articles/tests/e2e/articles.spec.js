var ArticlesPage = function ArticlesPage() {
	var HttpBackend = require('httpbackend');
	var backend = null;

	this.get = function () {
		browser.get('/#!/articles');
	};

	this.getToast = function () {
		return element(by.css('.toast'));
	};

	this.getCreateButton = function () {
		return element(by.css('button .fa.fa-plus'));
	};

	this.getNoArticlesAlert = function () {
		return element(by.css('.alert'));
	};

	this.getCreateText = function () {
		return element(by.css('.alert')).element(by.tagName('a'));
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

	this.deleteArticle = function (number) {
		element.all(by.css('li.list-group-item')).get(number).element(by.css('.btn-group-vertical .fa.fa-trash')).click();
	}

	this.getDeleteModal = function () {
		return element(by.css('.panel.panel-danger'));
	};

	this.getDeleteArticleTitle = function () {
		return element(by.css('.panel.panel-danger')).element(by.css('.panel-body')).getText();
	};

	this.cancelDelete = function () {
		element(by.css('.panel.panel-danger')).element(by.css('.btn-default')).click();
	}

	this.confirmDelete = function () {
		element(by.css('.panel.panel-danger')).element(by.css('.btn-danger')).click();
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
			backend.whenPUT('/api/article/' + i).respond(_article);
			backend.whenDELETE('/api/article/' + i).respond(_article);

		};
		backend.whenGET('/api/articles').respond(_articles);
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

describe('Articles Page: ', function() {
	var Page = new ArticlesPage();

	it('should not show delete modal', function() {
		Page.get();

		expect(Page.getDeleteModal().isPresent()).toBeFalsy();
	});

	describe('when guest enter the page', function() {
		it('should not show create article button', function() {
			Page.get();

			expect(Page.getCreateButton().isPresent()).toBeFalsy();
		});

		it('should not show create article text', function() {
			expect(Page.getCreateText().isPresent()).toBeFalsy();
		});

		describe('if there is no article', function() {
			it('should show no-article alert', function() {
				expect(Page.getNoArticlesAlert().isPresent()).toBeTruthy();
			});

			it('should not show any article', function() {
				expect(Page.getArticleList().count()).toBe(0);
			});
		});

		describe('if there is articles', function() {
			beforeAll(function() {
				Page.setBackend();
				Page.setArticlesRoute(3);

				Page.get();
			});
			

			it('should show articles list of 3', function() {
				expect(Page.getArticleList().count()).toBe(3);
			});

			it('should show newset article at top', function() {
				expect(Page.getArticleAuthorAndDate(0).getText()).toContain('March');
			})

			it('should not show any edit and remove button', function() {
				for(var i = 0; i < 3; i++) {
					expect(Page.getEditAndRemoveButton(i).isPresent()).toBeFalsy();
				}
			});

			afterAll(function() {
				Page.clearBackend();
			});
			
		});
	});

	describe('when users enter the page', function() {
		beforeAll(function() {
			Page.setBackend();
			Page.signin()
		});

		describe('if there is no article', function() {
			it('should show create article button', function() {
				expect(Page.getCreateButton().isPresent()).toBeTruthy();
			});

			it('should show create article text', function() {
				expect(Page.getCreateText().isPresent()).toBeTruthy();
			});
		});

		describe('if there is articles', function() {
			beforeAll(function() {
				Page.setBackend();
				Page.setArticlesRoute(3);

				Page.get();
			});
			
			it('should show articles list of 3', function() {
				expect(Page.getArticleList().count()).toBe(3);
			});

			it('should not show edit and remove button if not author', function() {
				expect(Page.getEditAndRemoveButton(0).isPresent()).toBeFalsy();
			});

			it('should show edit and remove button if author', function() {
				expect(Page.getEditAndRemoveButton(2).isPresent()).toBeTruthy();
			});

			describe('if user click remove article', function() {
				it('should show delete modal', function() {
					Page.deleteArticle(2);
					expect(Page.getDeleteModal().isPresent()).toBeTruthy();
				});

				it('should have article title in delete modal', function() {
					expect(Page.getDeleteArticleTitle()).toContain('article title 0');
				});

				it('should show toast and close popup if user confirm delete', function() {
					Page.confirmDelete();

					expect(Page.getDeleteModal().isPresent()).toBeFalsy();
					expect(Page.getToast().isPresent()).toBeTruthy();
				});

				it('should not have article that was removed in list', function() {
					expect(Page.getArticleList().count()).toBe(2);
				});
			});
		});

		afterAll(function() {
			browser.sleep(5500);
			Page.signout();

			Page.clearBackend();
		});
	});

});