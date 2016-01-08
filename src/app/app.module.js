(function() {
    'use strict';

    angular
        .module('mean', [
            'ui.router',
            'ui.bootstrap',
            'angular-jwt',
            'angular-storage',
            'toastr',

            'mean.core',
            'mean.users',
            'mean.articles'
        ]);
})();