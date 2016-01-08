(function() {
    'use strict';

    angular
        .module('mean.users')
        .controller('SigninController', SigninController);

    function SigninController(AuthFactory) {
        var vm = this;
        vm.credentials = {};
        vm.credentials.username = '';
        vm.credentials.password = '';

        vm.error = null;

        vm.isShowPwd = false;
        vm.pwdType   = 'password';

		vm.showPwd = showPwd;
		vm.signin  = signin;

		/////////

		function showPwd() {
			vm.isShowPwd = !vm.isShowPwd;
			vm.pwdType = vm.isShowPwd ? 'text' : 'password';
		}

		function signin(isValid) {
			if(isValid) {
				AuthFactory.signin(vm.credentials).error(function() {
					vm.error = AuthFactory.error;
				});
			}
		}
    }
})();