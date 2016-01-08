(function() {
    'use strict';

    angular
        .module('mean.users')
        .directive('verifyUnique', verifyUnique);

    function verifyUnique(AuthFactory, $q) {
        var directive = {
            link: verifyUniqueLink,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function verifyUniqueLink(scope, element, attrs, ngModelController) {
        	ngModelController.$asyncValidators.unique = validate;

        	function validate (modelValue, viewValue) {
        		var value = modelValue || viewValue;

        		return AuthFactory.verifyUsername(value)
        			.then(function() {
                        return true;
        			}, function() {
                        return $q.reject('exists');
        			});
        	}
        }
    }
})();