(function() {
    'use strict';

    angular
        .module('mean.articles')
        .controller('EditArticleController', EditArticleController);

    function EditArticleController($stateParams, ArticlesFactory, $state) {
        var vm = this;

        vm.articleID = $stateParams.id;
        vm.article = {};

        vm.submit = submit;

        ArticlesFactory.read(vm.articleID)
        	.then(function() {
        		var username = ArticlesFactory.articles.author.username;
        		if(ArticlesFactory.hasAuthorize(username)) {
        			vm.article = ArticlesFactory.articles;
        		} else {
        			$state.go('main.not-authorize');
        		}
        	});

        ////////////////

        function submit(isValid) {
        	if(isValid) {
        		ArticlesFactory.update(vm.article);
        	}
        }
    }
})();