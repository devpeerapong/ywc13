(function() {
    'use strict';

    angular
        .module('mean.users')
        .run(UsersRun);

    function UsersRun($rootScope, $state, store, jwtHelper, AuthFactory) {
    	$rootScope.$on('$stateChangeStart', function(e, to) {
			if (to.data && to.data.bypassUser) {
				if (AuthFactory.isSignin()) {
					e.preventDefault();
					$state.go('main.articles');
				}
			}
		});
	}

})();