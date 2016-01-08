describe('Authentication Factory', function() {
	beforeEach(module('mean'));

	var AuthFactory;
	var store;
	var $httpBackend;
	var $state;
	var $location;
	var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.Nb0RiSPWPgaTuBIsVozDasGoQVkGQ1nk2IyVFYTw-oM";

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		$state		 = $injector.get('$state');
		$location	 = $injector.get('$location');
		store		 = $injector.get('store');
		AuthFactory  = $injector.get('AuthFactory');

		$httpBackend.whenGET(/views.*/).respond(200, '');
	}));

	describe('require function', function() {
		it('should have signin()', function() {
			expect(AuthFactory.signin).toBeDefined();
		});

		it('should have signout()', function() {
			expect(AuthFactory.signout).toBeDefined();
		});

		it('should have register()', function() {
			expect(AuthFactory.register).toBeDefined();
		});

		it('should have verifyUsername()', function() {
			expect(AuthFactory.verifyUsername).toBeDefined();
		});

		it('should have getCurrentUser()', function() {
			expect(AuthFactory.getCurrentUser).toBeDefined();
		});

		it('should have isSignin()', function() {
			expect(AuthFactory.isSignin());
		});
	});

	describe('precondition - not signin', function() {
		beforeAll(function() {
			store.remove('jwt');
		});
		
		it('should not have user if user never signin', function() {
			expect(AuthFactory.currentUser).toBeNull();
		});
	});

	describe('precondition - sign in before', function() {
		beforeAll(function() {
			store.set('jwt', jwt);
		});

		it('should set user data if user have jwt in session', function() {
			expect(AuthFactory.currentUser.username).toBe('testusername');
		});

		afterAll(function() {
			store.remove('jwt');
		});
	});



	describe('signin()', function() {

		it('should set recieved jwt to store if signin successful', function() {
         	$httpBackend.expectPOST('/api/auth/signin')
         		.respond(200, { token: jwt });

         	AuthFactory.signin();
         	$httpBackend.flush();

         	expect(store.get('jwt')).toEqual(jwt);
		});

		it('should set correct user data if signin successful', function() {
         	$httpBackend.expectPOST('/api/auth/signin')
         		.respond(200, { token: jwt });

         	AuthFactory.signin();
         	$httpBackend.flush();

         	expect(AuthFactory.currentUser.username).toBe('testusername');
		});

		it('should redirected to articles page if signin successful', function() {
         	$httpBackend.expectPOST('/api/auth/signin')
				.respond(200, { token: jwt });

			AuthFactory.signin();
         	$httpBackend.flush();

			expect($state.current.name).toBe('main.articles');
			expect($location.url()).toBe('/articles');
		});

		it('should not do anything if signin fail', function() {
         	$httpBackend.expectPOST('/api/auth/signin')
				.respond(401, { message: 'Username or password does not exist.' });

			var b4User = AuthFactory.currentUser;
			AuthFactory.signin();
			$httpBackend.flush();

			expect(AuthFactory.currentUser).toEqual(b4User);
		});

		it('should set error data if signin fail', function() {
			$httpBackend.expectPOST('/api/auth/signin')
				.respond(401, { message: 'Username or password does not exist.' });

			AuthFactory.signin();
			$httpBackend.flush();

			expect(AuthFactory.error).toBe('Username or password does not exist.');
		});

		afterEach(function() {
			store.remove('jwt');
		});
	});

	describe('signout()', function() {
		beforeAll(function() {
			$httpBackend.expectPOST('/api/auth/signin')
				.respond(200, { token: jwt });
		});

		it('should not have jwt in session if signout success', function() {
			AuthFactory.signin().then(function() {
				AuthFactory.signout();
			});

			expect(store.get('jwt')).toBeNull();
		});

		it('should not have user data if signout success', function() {
			AuthFactory.signin().then(function() {
				AuthFactory.signout();
			});

			expect(AuthFactory.currentUser).toBeNull();
		});

		it('should redirect user to main page', function() {
			AuthFactory.signin().then(function() {
					AuthFactory.signout();
					expect($location.url()).toBe('/');
				});
		});
	});

	describe('register()', function() {
		it('should set provided jwt if register successful', function() {
			$httpBackend.expectPOST('/api/auth/register')
				.respond(200, { token: jwt });

			AuthFactory.register();
			$httpBackend.flush();

			expect(store.get('jwt')).toEqual(jwt);
		});

		it('should set correct user data if register successful', function() {
			$httpBackend.expectPOST('/api/auth/register')
				.respond(200, { token: jwt });

			AuthFactory.register();
			$httpBackend.flush();

			expect(AuthFactory.currentUser.username).toBe('testusername');
		});

		it('should redirect to articles page if regiser successful', function() {
			$httpBackend.expectPOST('/api/auth/register')
				.respond(200, { token: jwt });

			AuthFactory.register();
			$httpBackend.flush();

			expect($location.url()).toBe('/articles');
		});

		afterEach(function() {
			store.remove('jwt');
		});
	});

	describe('verifyUsername()', function() {
		it('should return true if username is not duplicate', function() {
			$httpBackend.expectPOST('/api/auth/verify')
				.respond(200, { message: 'username is approved' });

			AuthFactory.verifyUsername();
			$httpBackend.flush();

			expect(AuthFactory.verify).toBeTruthy();
			
		});

		it('should return false if username is not duplicate', function() {
			$httpBackend.expectPOST('/api/auth/verify')
				.respond(401, { message: 'username is already taken' });
		
			AuthFactory.verifyUsername();
			$httpBackend.flush();

			expect(AuthFactory.verify).toBeFalsy();
		});
	});

	describe('getCurrentUser()', function() {
		it('should return currrent user data', function() {
			AuthFactory.currentUser = { username: 'testusername' };

			expect(AuthFactory.getCurrentUser().username).toBe('testusername');
		});
	});

	describe('isSignin()', function() {
		beforeAll(function() {
			$httpBackend.expectPOST('/api/auth/signin')
         		.respond(200, { token: jwt });

         	AuthFactory.signin();
         	$httpBackend.flush();
		});

		it('should return true if there is user data', function() {
			expect(AuthFactory.isSignin()).toBeTruthy();
			AuthFactory.signout();
		});

		it('should return false if there is no user data', function() {
			expect(AuthFactory.isSignin()).toBeFalsy();
		});
	});

});