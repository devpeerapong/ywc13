describe('User Service: ', function() {
	beforeEach(module('mean'));

	var UserService;
	var User;

	beforeEach(inject(function($injector) {
		User = $injector.get('User');
		UserService = $injector.get('UserService');
	}));

	describe('getAll()', function() {
		it('should return all user data', function() {
			expect(UserService.getAll()).toEqual(User.mockData);
		});
	});

	describe('getById(2)', function() {
		it('should return user with id 2', function() {
			expect(UserService.getById(2)).toEqual(User.mockData[2]);
		});
	});

	describe('create()', function() {
		it('should create new user', function() {
			var user = { username: 'username', password: 'password' };

			UserService.create(user);

			expect(User.mockData.length).toBe(11);
			expect(User.mockData[10]).toBe(user);
		});
	});

	describe('delete(5)', function() {
		it('should delete new user', function() {
			UserService.delete(5);

			expect(User.mockData.length).toBe(9);
			expect(User.mockData[5].id).toBe(6);
		});
	});
});