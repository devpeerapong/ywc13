(function() {
    'use strict';

    angular
        .module('mean.articles')
        .factory('ArticlesFactory', ArticlesFactory);

    function ArticlesFactory($http, $state, toastr, AuthFactory) {
    	var factory = {};

        factory.articles = [];

        factory.create       = create;
        factory.read         = read;
        factory.update       = update;
        factory.delete       = del;
        factory.findAll      = findAll;
        factory.hasAuthorize = hasAuthorize;

        return factory;

        ////////////////

        function create(article) {
            $state.go('main.articles');
            return $http.post('/api/articles', { article: article })
                .success(function (res) {
                    toastr.success('Create article success');
                    $state.go('main.article', { id: res._id });
                })
                .error(function (){ 
                    toastr.error('Something wrong, please try again');
                });

        }

        function read(id) {
            return $http.get('/api/article/' + id)
                .success(function (res) {
                    factory.articles = res;
                })
                .error(function () {
                    $state.go('main.not-found');
                });

        }

        function update(article) {
            return $http.put('/api/article/' + article._id)
                .success(function (res) {
                    factory.articles = res;
                    toastr.success('Update article success');
                    $state.go('main.article', { id: res._id });
                })
                .error(function (){ 
                    toastr.error('Something wrong, please try again');
                });
        }

        function del(id) {
            return $http.delete('/api/article/' + id)
                .success(function () {
                    toastr.success('Delete article success');
                })
                .error(function (){ 
                    toastr.error('Something wrong, please try again');
                });
        }

        function findAll() {
            return $http.get('/api/articles')
                .success(function (res) {
                    factory.articles = res;
                });
        }

        function hasAuthorize(username) {
            if(AuthFactory.currentUser.username === username) {
                return true;
            }

            return false;
        }

    }
})();