describe('Articles Factory', function() {
	beforeEach(module('mean'));

	var ArticlesFactory;
	var AuthFactory;
	var $httpBackend;
	var $location;
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
		$httpBackend = $injector.get('$httpBackend');
		$httpBackend.whenGET(/views.*/).respond(200, '');
		$httpBackend.whenPOST('/api/auth/signin').respond(200, { token: jwt });

		ArticlesFactory = $injector.get('ArticlesFactory');
		AuthFactory = $injector.get('AuthFactory');
		toastr = $injector.get('toastr');
		$location = $injector.get('$location');

	}));

	describe('required function', function() {
		it('should have CRUD', function() {
			expect(ArticlesFactory.create).toBeDefined();
			expect(ArticlesFactory.read).toBeDefined();
			expect(ArticlesFactory.update).toBeDefined();
			expect(ArticlesFactory.delete).toBeDefined();
		});

		it('should have findAll()', function() {
			expect(ArticlesFactory.findAll).toBeDefined();
		});

		it('should have hasAuthorize()', function() {
			expect(ArticlesFactory.hasAuthorize).toBeDefined();
		});
	});

	describe('create()', function() {
		beforeAll(function() {
			AuthFactory.signin();
			$httpBackend.flush();
		});

		it('should redirect to article page if create success', function() {
			$httpBackend.expectPOST('/api/articles')
				.respond(200, mockArticle);

			ArticlesFactory.create(mockArticle);
			$httpBackend.flush();
			expect($location.url()).toBe('/article/' + mockArticle._id);
		});

		it('should show toast if create successful', function() {
			spyOn(toastr, 'success');
			$httpBackend.expectPOST('/api/articles')
				.respond(200, mockArticle);

			ArticlesFactory.create(mockArticle._id);
			$httpBackend.flush();

			expect(toastr.success).toHaveBeenCalled();
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});

	describe('read()', function() {
		it('should set article data correctly', function() {
			$httpBackend.expectGET('/api/article/' + mockArticle._id)
				.respond(200, mockArticle);

			ArticlesFactory.read(mockArticle._id);
			$httpBackend.flush();

			expect(ArticlesFactory.articles).toEqual(mockArticle);
		});
	});

	describe('update()', function() {
		it('should redirect to article page if create success', function() {
			$httpBackend.expectPUT('/api/article/' + mockArticle._id)
				.respond(200, mockArticle);

			ArticlesFactory.update(mockArticle);
			$httpBackend.flush();

			expect($location.url()).toBe('/article/' + mockArticle._id);
		});

		it('should show toast success if update successful', function() {
			spyOn(toastr, 'success');
			$httpBackend.expectPUT('/api/article/' + mockArticle._id)
				.respond(200, mockArticle);

			ArticlesFactory.update(mockArticle);
			$httpBackend.flush();

			expect(toastr.success).toHaveBeenCalled();
		});
	});

	describe('delete()', function() {
		it('should show toast success if delete success', function() {
			spyOn(toastr, 'success');
			$httpBackend.expectDELETE('/api/article/' + mockArticle._id)
				.respond(200, { message: 'delete article successful' });

			ArticlesFactory.delete(mockArticle._id);
			$httpBackend.flush();

			expect(toastr.success).toHaveBeenCalled();
		});
	});

	describe('findAll()', function() {
		it('should set article data in array correctly', function() {
			$httpBackend.expectGET('/api/articles')
				.respond(200, [ mockArticle ]);

			ArticlesFactory.findAll();
			$httpBackend.flush();

			expect(ArticlesFactory.articles).toEqual([mockArticle]);
		});
	});

	describe('hasAuthorize', function() {
		beforeAll(function() {
			AuthFactory.signin();
			$httpBackend.flush();
		});

		it('should return false if author is not the same as user', function() {
			mockArticle.author.username = 'aaaaa';
			expect(ArticlesFactory.hasAuthorize(mockArticle.author.username)).toBeFalsy();
		});

		it('should return true if author is the same as user', function() {
			mockArticle.author.username = 'testusername';
			expect(ArticlesFactory.hasAuthorize(mockArticle.author.username)).toBeTruthy();
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});
});