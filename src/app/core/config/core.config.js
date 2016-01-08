(function() {
    'use strict';

    angular
        .module('mean.core')
        .config(MeanConfig);

    function MeanConfig(jwtInterceptorProvider, $httpProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

    	jwtInterceptorProvider.tokenGetter = ['store', function(store) {
		    return store.get('jwt');
		}];
		$httpProvider.interceptors.push('jwtInterceptor');
    }
})();