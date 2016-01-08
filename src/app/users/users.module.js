(function() {
    'use strict';

    angular
        .module('mean.users', [
            'ui.router',
            'ui.bootstrap',
            'angular-jwt',
            'angular-storage',
            'ngMessages'
        ]);
})();