describe('Navigation Controller', function() {
	beforeEach(module('mean'));

	var AuthFactory;
	var NavbarController;
	var $httpBackend;
	var $controller;
	var $state;
	var $location;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	beforeEach(inject(function ($injector) {
		$httpBackend = $injector.get('$httpBackend');
		$state       = $injector.get('$state');
		$location    = $injector.get('$location');

		AuthFactory  = $injector.get('AuthFactory');
		$controller    = $injector.get('$controller');
		NavbarController  = $controller('NavbarController');

		$httpBackend.whenGET(/views.*/).respond(200, '');

	}));

	describe('requires function', function() {
		it('should have signout function', function() {
			expect(NavbarController.signout).toBeDefined();
		});
	});

	describe('precondition', function() {
		it('should not have any users at first', function() {
			expect(NavbarController.user()).toBeNull();
		});
	});

	describe('when user signin', function() {
		it('should set user data to NavbarController', function() {
			$httpBackend.expectPOST('/api/auth/signin')
				.respond(200, { token: jwt });

			AuthFactory.signin();
         	$httpBackend.flush();
			expect(NavbarController.user().username).toBe('testusername');
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});

	describe('when user signout', function() {
		beforeAll(function() {
			$httpBackend.expectPOST('/api/auth/signin')
				.respond(200, { token: jwt });
			AuthFactory.signin();
		})
		it('should not have any user data left', function() {
			AuthFactory.signout();

			expect(NavbarController.user()).toBeNull();
		});
	});
});