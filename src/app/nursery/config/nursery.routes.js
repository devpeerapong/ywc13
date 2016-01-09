(function() {
    'use strict';

    angular
        .module('mean.nursery')
        .config(NurseryRoutes);

    function NurseryRoutes($urlRouterProvider, $stateProvider) {
    	$stateProvider
    		.state('nursery', {
    			abstract: true,
    			url: '/nursery',
    			templateUrl: 'app/nursery/views/main.view.html'
    		})
    		.state('nursery.index', {
    			url: '',
    			templateUrl: 'app/nursery/views/index.view.html'
    		})
            .state('nursery.profile-private', {
                url: '/:id/private',
                templateUrl: 'app/nursery/views/profile-private.view.html'
            });
    }

})();