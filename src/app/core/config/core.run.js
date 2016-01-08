(function() {
    'use strict';

    angular
        .module('mean.core')
        .run(MeanRun);

    function MeanRun($rootScope, $state, store, jwtHelper) {
    	$rootScope.$on('$stateChangeStart', function(e, to) {
			if (to.data && to.data.requiresLogin) {
				if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
					e.preventDefault();
					$state.go('main.not-authorize');
				}
			}
		});
	}

})();