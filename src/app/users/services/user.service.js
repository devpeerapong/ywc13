(function() {
    'use strict';

    angular
        .module('mean.users')
        .service('UserService', UserService);

    /* @ngInject */
    function UserService(User) {
        this.getAll = getAllUser;
        this.getById = getUserById;
        this.create = createUser;
        this.delete = deleteUser;

        function getAllUser() {
            return User.mockData;
        }

        function getUserById(id) {
            var userById = User.mockData.reduce(function(u, user) {
                if (user.id === id) {
                    return user;
                }

                return u;
            });

            return userById;
        }

        function createUser(user) {
            user.id = User.mockData.length;
            User.mockData.push(user);
        }

        function deleteUser(id) {
            User.mockData = User.mockData.filter(function(user) {
                if (user.id === id) {
                    return false;
                }

                return true;
            });
        }
    }
})();
