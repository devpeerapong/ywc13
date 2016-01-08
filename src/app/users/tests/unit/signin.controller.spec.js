describe('Signin Controller', function() {
	beforeEach(module('mean'));

	var SigninController;
	var AuthFactory;
	var $httpBackend;
	var $controller;
	var $location;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	beforeEach(inject(function ($injector) {
		$controller  = $injector.get('$controller');
		$httpBackend = $injector.get('$httpBackend');
		$location    = $injector.get('$location');

		SigninController = $controller('SigninController');
		NavbarController = $controller('NavbarController');
		AuthFactory      = $injector.get('AuthFactory');

		$httpBackend.whenGET(/views.*/).respond(200, '');
	}));

	describe('requires function', function() {
		it('should have showPwd()', function() {
			expect(SigninController.showPwd).toBeDefined();
		});

		it('should have signin()', function() {
			expect(SigninController.signin).toBeDefined();
		});
	});

	describe('precondition', function() {
		it('should not show password at first', function() {
			expect(SigninController.isShowPwd).toBeFalsy();
			expect(SigninController.pwdType).toBe('password');
		});
	});

	describe('showPwd()', function() {
		it('should show password if password is not show', function() {
			SigninController.showPwd();

			expect(SigninController.isShowPwd).toBeTruthy();
			expect(SigninController.pwdType).toBe('text');
		});

		it('should not show password if password is show', function() {
			SigninController.isShowPwd = true;

			SigninController.showPwd();

			expect(SigninController.isShowPwd).toBeFalsy();
			expect(SigninController.pwdType).toBe('password');
		});
	});

	describe('signin()', function() {
		it('should not signin if form is invalid', function() {
			spyOn(AuthFactory, 'signin');

			SigninController.signin(false);
			expect(AuthFactory.signin).not.toHaveBeenCalled();
		});

		it('should signin if form is valid', function() {
			$httpBackend.whenPOST('/api/auth/signin')
				.respond(200, { token: jwt } );

			SigninController.signin(true);
			$httpBackend.flush();

			expect(AuthFactory.getCurrentUser().username).toBe('testusername');
		});

		it('should set error data if signin fail', function() {
			$httpBackend.whenPOST('/api/auth/signin')
				.respond(401, { message: 'invalid username or password' } );

			SigninController.signin(true);
			$httpBackend.flush();

			expect(SigninController.error).toBe('invalid username or password');
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});
});