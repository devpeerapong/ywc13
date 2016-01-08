describe('Create Article Controller', function() {
	beforeEach(module('mean'));

	var $httpBackend;
	var $controller;
	var ArticlesFactory;
	var CreateArticleController;
	var AuthFactory;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";
	beforeEach(inject(function ($injector) {
		$httpBackend          = $injector.get('$httpBackend');
		$httpBackend.whenGET(/views.*/).respond(200, '');
		$httpBackend.whenPOST('/api/auth/signin').respond(200, { token: jwt });

		$controller           	= $injector.get('$controller');
		ArticlesFactory       	= $injector.get('ArticlesFactory');
		AuthFactory       		= $injector.get('AuthFactory');
		AuthFactory.currentUser = jwt;
		CreateArticleController = $controller('CreateArticleController');

	}));

	describe('requires function', function() {
		it('should have submit()', function() {
			expect(CreateArticleController.submit).toBeDefined();
		});
	});

	describe('submit()', function() {
		it('should not submit if form is invalid', function() {
			spyOn(ArticlesFactory, 'create');

			CreateArticleController.submit(false);

			expect(ArticlesFactory.create).not.toHaveBeenCalled();
		});

		it('should submit if form is valid', function() {
			spyOn(ArticlesFactory, 'create');

			CreateArticleController.submit(true);

			expect(ArticlesFactory.create).toHaveBeenCalled();
		});
	});
});