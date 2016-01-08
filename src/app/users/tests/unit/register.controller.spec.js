describe('Register Controller', function() {
	beforeEach(module('mean'));

	var RegisterController;
	var AuthFactory;
	var $httpBackend;
	var $controller;
	var $location;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	beforeEach(inject(function ($injector) {
		$controller  = $injector.get('$controller');
		$httpBackend = $injector.get('$httpBackend');
		$location    = $injector.get('$location');

		RegisterController = $controller('RegisterController');
		AuthFactory      = $injector.get('AuthFactory');

		$httpBackend.whenGET(/views.*/).respond(200, '');
	}));

	describe('requires function', function() {
		it('should have showPwd()', function() {
			expect(RegisterController.showPwd).toBeDefined();
		});

		it('should have register()', function() {
			expect(RegisterController.register).toBeDefined();
		});

	});

	describe('precondition', function() {
		it('should not show password at first', function() {
			expect(RegisterController.isShowPwd).toBeFalsy();
			expect(RegisterController.pwdType).toBe('password');
		});

		it('should set verify to false at first', function() {
			expect(RegisterController.verify).toBeFalsy();
		});
	});

	describe('showPwd()', function() {
		it('should show password if password is not show', function() {
			RegisterController.showPwd();

			expect(RegisterController.isShowPwd).toBeTruthy();
			expect(RegisterController.pwdType).toBe('text');
		});

		it('should not show password if password is show', function() {
			RegisterController.isShowPwd = true;

			RegisterController.showPwd();

			expect(RegisterController.isShowPwd).toBeFalsy();
			expect(RegisterController.pwdType).toBe('password');
		});
	});

	describe('register()', function() {
		it('should not register if form is invalid', function() {
			spyOn(AuthFactory, 'register');

			RegisterController.register(false);
			expect(AuthFactory.register).not.toHaveBeenCalled();
		});

		it('should register if form is valid', function() {
			$httpBackend.whenPOST('/api/auth/register')
				.respond(200, { token: jwt } );

			RegisterController.register(true);
			$httpBackend.flush();

			expect(AuthFactory.getCurrentUser().username).toBe('testusername');
		});

		it('should set error data if register fail', function() {
			$httpBackend.whenPOST('/api/auth/register')
				.respond(401, { message: 'invalid username or password' } );

			RegisterController.register(true);
			$httpBackend.flush();

			expect(RegisterController.error).toBe('invalid username or password');
		});

		afterAll(function() {
			AuthFactory.signout();
		});
	});
});