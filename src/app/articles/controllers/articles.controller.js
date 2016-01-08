(function() {
    'use strict';

    angular
        .module('mean.articles')
        .controller('ArticlesController', ArticlesController);

    function ArticlesController($uibModal, ArticlesFactory) {
        var vm = this;

        vm.articles = [];

        vm.confirmDelete = confirmDelete;

        ArticlesFactory.findAll()
            .then(function () {
                vm.articles = ArticlesFactory.articles;
            });

        /////////

        function confirmDelete(article) {
            if (ArticlesFactory.hasAuthorize(article.author.username)) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/articles/views/delete-article.view.html',
                    controller: 'DeleteArticleController',
                    controllerAs: 'DACTRL',
                    resolve: {
                        article: function () {
                            return article;
                        }
                    }
                });

                if(modalInstance) {
                    modalInstance.result.then(function () {
                        vm.articles.splice(vm.articles.indexOf(article), 1);
                    });    
                }
                
            }
        }
    }
})();