(function() {
    'use strict';

    angular
        .module('mean.core')
        .directive('datetimepicker', datetimepicker);

    /* @ngInject */
    function datetimepicker() {
        var tpl = '<p class=\"input-group\">' +
            '<input type=\"text\" class=\"form-control input-sm\"' +
            'datetime-picker=\"{{ DatetimepickerCtrl.format }}\"' +
            'ng-model=\"myDate\" is-open=\"DatetimepickerCtrl.isOpen\"' +
            'datepicker-options=\"DatetimepickerCtrl.datepickerOption\"' +
            'timepicker-options=\"DatetimepickerCtrl.timepickerOption\"' +
            'enable-date=\"DatetimepickerCtrl.onlyDate\"' +
            'enable-time=\"DatetimepickerCtrl.onlyTime\" />' +
            '<span class=\"input-group-btn\"><button type=\"button\"' +
            'class=\"btn btn-default\"' +
            'ng-click=\"DatetimepickerCtrl.openCalendar($event, prop)\">' +
            '<i class=\"fa fa-calendar\"></i></button></span>' +
            '</p>';
        var directive = {
            template: tpl,
            bindToController: true,
            controller: DatetimepickerController,
            controllerAs: 'DatetimepickerCtrl',
            restrict: 'E',
            scope: {
                model: '=',
                format: '@',
                onlyDate: '=',
                onlyTime: '='
            }
        };
        return directive;
    }

    /* @ngInject */
    function DatetimepickerController() {
        var vm = this;
        vm.onlyDate = vm.onlyDate || false;
        vm.onlyTime = vm.onlyTime || false;

        if (!vm.onlyDate && !vm.onlyTime) {
            vm.onlyTime = true;
            vm.onlyDate = true;
        }

        vm.isOpen = false;

        vm.datepickerOption = { showWeeks: false };
        vm.timepickerOption = { showMeridian: false };
        vm.openCalendar = openCalendar;

        function openCalendar(e) {
            e.preventDefault();
            e.stopPropagation();

            vm.isOpen = true;
        }
    }
})();