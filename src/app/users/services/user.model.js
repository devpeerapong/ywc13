(function() {
    'use strict';

    angular
        .module('mean.users')
        .factory('User', User);

    /* @ngInject */
    function User() {
        var factory = {};
        factory.data = [];
        factory.mockData = generateMock();

        return factory;

        function generateMock() {
            var users = [];
            for (var i = 0; i < 10; i++) {
                var user = {
                    id: i,
                    username: 'user' + i,
                    password: 'pass' + i
                };
                users.push(user);
            }
            return users;
        }
    }
})();
