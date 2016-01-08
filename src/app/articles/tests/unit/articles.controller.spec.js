describe('Articles Controller', function() {
	beforeEach(module('mean'));
	
	var $httpBackend;
	var $controller;
	var $location;
	var $uibModal;
	var ArticlesController;
	var ArticlesFactory;
	var AuthFactory;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	var mockArticle = {
		_id: 'adfj23nkrlmkkfadfadf2141',
		topic: 'title topic',
		content: 'article content',
		author: {
			username: 'eieiza55plus'
		},
		createdAt: new Date()
	};

	beforeEach(inject(function($injector) {
		$httpBackend       = $injector.get('$httpBackend');
		$location          = $injector.get('$location');
		$controller        = $injector.get('$controller');
		$uibModal        = $injector.get('$uibModal');
		ArticlesFactory    = $injector.get('ArticlesFactory');
		AuthFactory        = $injector.get('AuthFactory');
		ArticlesController = $controller('ArticlesController');

		$httpBackend.whenGET(/views.*/).respond(200, '');
		$httpBackend.whenPOST('/api/auth/signin').respond(200, { token: jwt });
	}));

	describe('requires function', function() {
		it('should have confirmDelete()', function() {
			expect(ArticlesController.confirmDelete).toBeDefined();
		});
	});

	describe('precondition', function() {
		it('should not have articles at first', function() {
        	expect(ArticlesController.articles.length).toBe(0);
		});

		it('should get article and set into array', function() {
			$httpBackend.expectGET('/api/articles')
				.respond(200, [mockArticle]);

			$httpBackend.flush();

			expect(ArticlesController.articles.length).not.toBe(0);
		})
	});

	describe('confirmDelete()', function() {
		beforeAll(function() {
			AuthFactory.signin();
			$httpBackend.flush();
		});

		it('should not show if user is not authorized', function() {
			spyOn($uibModal, 'open');

			ArticlesController.confirmDelete(mockArticle);

			expect($uibModal.open).not.toHaveBeenCalled();
		});

		it('should show if user is authorized', function() {
			spyOn($uibModal, 'open');
			mockArticle.author.username = 'testusername';

			ArticlesController.confirmDelete(mockArticle);

			expect($uibModal.open).toHaveBeenCalled();
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});
});