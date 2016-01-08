(function() {
    'use strict';

    angular
        .module('mean.users')
        .controller('RegisterController', RegisterController);

    function RegisterController(AuthFactory) {
        var vm = this;
        vm.credentials = {};
        vm.credentials.username = '';
        vm.credentials.password = '';

        vm.error = null;
        vm.verify = AuthFactory.verify;

        vm.isShowPwd = false;
        vm.pwdType   = 'password';

		vm.showPwd = showPwd;
		vm.register  = register;

		/////////

		function showPwd() {
			vm.isShowPwd = !vm.isShowPwd;
			vm.pwdType = vm.isShowPwd ? 'text' : 'password';
		}

		function register(isValid) {
			if(isValid) {
				AuthFactory.register(vm.credentials).error(function() {
					vm.error = AuthFactory.error;
				});
			}
		}
    }
})();