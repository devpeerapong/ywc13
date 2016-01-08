describe('User Model: ', function() {
	beforeEach(module('mean'));

	var User;

	beforeEach(inject(function($injector) {
		User = $injector.get('User');
	}));

	it('should have mock data', function() {
		expect(User.mockData).not.toEqual({});
	});

});