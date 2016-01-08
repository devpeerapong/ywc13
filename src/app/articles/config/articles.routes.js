(function() {
    'use strict';

    angular
        .module('mean.articles')
        .config(ArticlesRoutes);

    function ArticlesRoutes($stateProvider) {
    	$stateProvider
    		.state('main.articles', {
    			url: '/articles',
    			templateUrl: 'app/articles/views/articles.view.html',
    			controller: 'ArticlesController',
    			controllerAs: 'ArticlesCTRL'
    		})
    		.state('main.create-article', {
    			url: '/article/create',
    			templateUrl: 'app/articles/views/create-article.view.html',
    			controller: 'CreateArticleController',
    			controllerAs: 'CACTRL',
                data: {
                    requiresLogin: true
                }
    		})
    		.state('main.edit-article', {
    			url: '/article/:id/edit',
    			templateUrl: 'app/articles/views/edit-article.view.html',
    			controller: 'EditArticleController',
    			controllerAs: 'EACTRL',
                data: {
                    requiresLogin: true
                }
    		})
    		.state('main.article', {
    			url: '/article/:id',
    			templateUrl: 'app/articles/views/article.view.html',
    			controller: 'ArticleController',
    			controllerAs: 'ArticleCTRL'
    		});
    }
})();