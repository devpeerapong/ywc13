(function() {
    'use strict';

    angular
        .module('mean.core')
        .controller('NavbarController', NavbarController)
        .directive('navbar', NavbarDirective);

    function NavbarDirective() {
        var directive = {
            bindToController: true,
            controller: 'NavbarController',
            controllerAs: 'NavbarCTRL',
            restrict: 'E',
            templateUrl: 'app/core/directives/navbar/navbar.view.html'
        };
        return directive;
    }

    function NavbarController(AuthFactory) {
        var vm = this;
        vm.user = AuthFactory.getCurrentUser;
        vm.status = { isopen: false };
        vm.signout = signout;
        vm.toggleDropdown = toggleDropdown;

        ///////

        function signout() {
            AuthFactory.signout();
        }

        function toggleDropdown($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.status.isopen = !vm.status.isopen;
        }
    }
})();