(function() {
    'use strict';

    angular
        .module('mean.articles')
        .controller('CreateArticleController', CreateArticleController);

    function CreateArticleController(ArticlesFactory, AuthFactory) {
        var vm = this;

        vm.article = {
        	title: '',
        	content: '',
        	author: {
        		username: AuthFactory.getCurrentUser().username
        	}
        };

        vm.submit = submit;

        //////

        function submit(isValid) {
        	if (isValid) {
	        	vm.article.createdAt = new Date();
	        	ArticlesFactory.create(vm.article);
        	}
        }
    }
})();