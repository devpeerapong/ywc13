(function() {
    'use strict';

    angular
        .module('mean.core')
        .config(MeanRoutes);

    function MeanRoutes($urlRouterProvider, $stateProvider) {
    	$urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.get('$state').transitionTo('main.not-found', null, {
                location: false
            });
        });

    	$stateProvider
    		.state('main', {
    			abstract: true,
    			url: '',
    			templateUrl: 'app/core/views/main.view.html'
    		})
    		.state('main.index', {
    			url: '/',
    			templateUrl: 'app/core/views/index.view.html',
    			controller: 'MainController',
    			controllerAs: 'MainCTRL'
    		})
    		.state('main.not-found', {
    			url: '/404',
    			templateUrl: 'app/core/views/404.view.html',
    		})
    		.state('main.not-authorize', {
    			url: '/403',
    			templateUrl: 'app/core/views/403.view.html'
    		});
    }

})();