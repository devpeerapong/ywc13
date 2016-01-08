(function() {
    'use strict';

    angular
        .module('mean.users')
        .directive('validateOn', validateOn);

    function validateOn() {
        var directive = {
            link: validateOnLink,
            restrict: 'A',
            require: '^form'
        };
        return directive;

        function validateOnLink(scope, element, attrs, formCtrl) {
        	var input = formCtrl[attrs.validateOn];
            var validateOnSuccess = validateOnSuccess in attrs ? true : false;
        	element.append('<span class=\"help-block\"></span>');

        	scope.$watchGroup([ getValue, getUnique, getFormSubmitted ], function() {
        		if((!angular.equals({}, input.$error) && (input.$dirty || formCtrl.$submitted))) {
        			var err;
        			element.addClass('has-error');
        			for(var i in input.$error) {
        				if(i) {
        					err = i;
        				}
        			}
                    console.log(input.$valid);
        			element.find('span').text(attrs[err + 'Msg']);
                } else {
                    element.removeClass('has-error');
                    element.find('span').text('');

                    if(input.$dirty && attrs.validateOnSuccess) {
                        element.addClass('has-success');
                    }
        		}
        	});

        	function getValue() {
        		return input.$viewValue;
        	}

        	function getUnique() {
        		return input.$error.unique;
        	}

            function getFormSubmitted() {
                return formCtrl.$submitted;
            }
        }
    }

})();