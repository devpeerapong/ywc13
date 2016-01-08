(function() {
    'use strict';

    angular
        .module('mean.nursery')
        .service('NurseryService', NurseryService);

    /* @ngInject */
    function NurseryService(Nursery) {
        this.getAll = getAllNurse;

        ////////////////

        function getAllNurse() {
        	return Nursery.mockData;
        }
    }
})();