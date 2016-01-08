(function() {
    'use strict';

    angular
        .module('mean.articles')
        .controller('DeleteArticleController', DeleteArticleController);

    function DeleteArticleController($modalInstance, article, ArticlesFactory) {
        var vm = this;

        vm.article = article;

        vm.confirm = confirm;
        vm.cancel = cancel;

        /////////

        function confirm() {
            ArticlesFactory.delete(article._id);
        	$modalInstance.close();
        }

        function cancel() {
        	$modalInstance.dismiss('cancel');
        }
  }
})();