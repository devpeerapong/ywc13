var ArticlePage = function ArticlePage() {
	var HttpBackend = require('httpbackend');
	var backend = null;

	this.get = function () {
		browser.get('/#!/article/0');
	};

	this.getArticleList = function () {
		return element.all(by.css('li.list-group-item'));
	};

	this.getTitle = function () {
		return element(by.binding('ArticleCTRL.article.title')).getText();
	};

	this.getContent = function () {
		return element(by.binding('ArticleCTRL.article.content')).getText();
	};

	this.getAuthorAndDate = function () {
		return element(by.tagName('small')).getText();
	};

	this.clickToastr = function() {
		return element(by.css('.toastr')).click();
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
};

describe('Article Page: ', function() {
	var Page = new ArticlePage();

	beforeAll(function() {
		Page.setBackend();
		Page.setArticlesRoute(1);
		Page.get();
	});

	it('should show title', function() {
		expect(Page.getTitle()).toEqual('article title 0');
	});

	it('should show content', function() {
		expect(Page.getContent()).toEqual('article content 0');
	});

	it('should show author and date', function() {
		expect(Page.getAuthorAndDate()).toContain('2015');
		expect(Page.getAuthorAndDate()).toContain('author0');
	});

	afterAll(function() {
		Page.clearBackend();
	});
});