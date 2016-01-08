(function() {
    'use strict';

    angular
        .module('mean.articles')
        .controller('ArticleController', ArticleController);

    function ArticleController(ArticlesFactory, $stateParams) {
        var vm = this;
        vm.articleID = $stateParams.id;
        vm.article = {};
        ArticlesFactory.read(vm.articleID)
            .then(function() {
                vm.article = ArticlesFactory.articles;
            });
    }
})();