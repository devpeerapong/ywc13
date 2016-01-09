(function() {
    'use strict';

    angular
        .module('mean', [
            'ui.router',
            'ui.bootstrap',
            'ui.select',
            'angular-jwt',
            'angular-storage',
            'toastr',
            'ui.bootstrap.datetimepicker',

            'ngSanitize',

            'mean.core',
            'mean.users',
            'mean.articles',
            'mean.nursery'
        ]);
})();