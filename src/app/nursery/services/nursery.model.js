(function() {
    'use strict';

    angular
        .module('mean.nursery')
        .factory('Nursery', Nursery);

    /* @ngInject */
    function Nursery() {
    	var factory = {};
    	factory.data = {};
    	factory.mockData = generateMock();

    	return factory;

    	function generateMock() {
    		var nurseries = [];

    		for (var i = 0; i < 10; i++) {
    			var nurse = {
    				id: i,
    				username: 'user' + i,
    				password: 'pass' + i,
    				profile: {
    					prefix: 'Mr.',
    					firstname: 'firstname' + 1,
    					lastname: 'lastname' + 1
    				},
    				qualify: false
    			};

    			nurseries.push(nurse);
    		}

    		return nurseries;
    	}
    }
})();