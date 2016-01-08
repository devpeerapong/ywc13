(function() {
    'use strict';

    angular
        .module('mean.users')
        .config(UsersRoutes);

    function UsersRoutes($urlRouterProvider, $stateProvider) {
    	$stateProvider
    		.state('main.signin', {
    			url: '/signin',
    			templateUrl: 'app/users/views/signin.view.html',
    			controller: 'SigninController',
    			controllerAs: 'SigninCTRL',
                data: {
                    bypassUser: true
                }
    		})
    		.state('main.register', {
    			url: '/register',
    			templateUrl: 'app/users/views/register.view.html',
    			controller: 'RegisterController',
    			controllerAs: 'RegisterCTRL',
                data: {
                    bypassUser: true
                }
    		});
    }

})();