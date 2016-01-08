describe('Edit Article Controller', function() {
	beforeEach(module('mean'));

	var $httpBackend;
	var $location;
	var $controller;
	var $stateParams;
	var AuthFactory;
	var ArticlesFactory;
	var EditArticleController;
	var mockArticle = {
		_id: 'adfj23nkrlmkkfadfadf2141',
		topic: 'title topic',
		content: 'article content',
		author: {
			username: 'testusername'
		},
		createdAt: new Date()
	};
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	beforeEach(inject(function ($injector) {
		$httpBackend          = $injector.get('$httpBackend');
		$httpBackend.whenGET(/views.*/).respond(200, '');
		$httpBackend.whenPOST('/api/auth/signin').respond(200, { token: jwt });

		$location             = $injector.get('$location');
		$controller           = $injector.get('$controller');
		$stateParams          = $injector.get('$stateParams');
		AuthFactory           = $injector.get('AuthFactory');
		ArticlesFactory           = $injector.get('ArticlesFactory');
		EditArticleController = $controller('EditArticleController');

	}));

	describe('requires function', function() {
		it('should have submit()', function() {
			expect(EditArticleController.submit).toBeDefined();
		});

		it('should not have article at first', function() {
			expect(EditArticleController.article).toEqual({});
		});
	});

	describe('submit()', function() {
		it('should not submit if form is invalid', function() {
			spyOn(ArticlesFactory, 'update');

			EditArticleController.submit(false);

			expect(ArticlesFactory.update).not.toHaveBeenCalled();
		});

		it('should submit if form is valid', function() {
			spyOn(ArticlesFactory, 'update');

			EditArticleController.submit(true);

			expect(ArticlesFactory.update).toHaveBeenCalled();
		});
	});
});