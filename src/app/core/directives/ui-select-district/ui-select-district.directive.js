(function() {
    'use strict';

    angular
        .module('mean.core')
        .directive('uiSelectDistrict', uiSelectDistrict);

    /* @ngInject */
    function uiSelectDistrict() {
        var directive = {
        	templateUrl: 'app/core/directives/ui-select-district/ui-select-district.view.html',
            bindToController: true,
            controller: DistrictSelectController,
            controllerAs: 'DistrictSelectCtrl',
            restrict: 'E',
            scope: {
            	model: '=',
                disabled: '='
            }
        };
        return directive;
    }

    /* @ngInject */
    function DistrictSelectController() {
    	var vm = this;
    	vm.districts = ['district1', 'district2'];
    }
})();