(function() {
    'use strict';

    angular
        .module('mean.users')
        .factory('AuthFactory', AuthFactory);

    function AuthFactory(store, jwtHelper, $http, $state) {
    	var factory = {};

    	factory.currentUser = store.get('jwt') ? jwtHelper.decodeToken(store.get('jwt')) : null;

        factory.verify = false;
        factory.error = null;

        factory.signin         = signin;
        factory.signout        = signout;
        factory.register       = register;
        factory.verifyUsername = verifyUsername;
        factory.getCurrentUser = getCurrentUser;
        factory.isSignin       = isSignin;

    	return factory;

    	///////////

    	function signin(credentials) {
    		return $http.post('/api/auth/signin', credentials)
    			.success(setUserAndRedirect)
                .error(function (response) {
                    factory.error = response.message;
                });
    	}

    	function signout() {
            store.remove('jwt');
            factory.currentUser = null;
            $state.go('main.index');
    	}

    	function register(credentials) {
            return $http.post('/api/auth/register', credentials)
                .success(setUserAndRedirect)
                .error(function (response) {
                    factory.error = response.message;
                });
    	}

        function verifyUsername(username) {
            return $http.post('/api/auth/verify', { username: username })
                .success(function (response) {
                    factory.verify = true;
                })
                .error(function (response) {
                    factory.verify = false;
                });
        }

        function getCurrentUser() {
            return factory.currentUser;
        }

        function isSignin() {
            return factory.getCurrentUser() !== null ? true : false;
        }

        ///////////

        function setUserAndRedirect(response) {
            factory.error = null;
            store.set('jwt', response.token);
            factory.currentUser = jwtHelper.decodeToken(store.get('jwt'));
            $state.go('main.articles');
        }
    }
})();