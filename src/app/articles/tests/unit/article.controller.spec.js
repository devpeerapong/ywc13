describe('Article Controller', function() {
    beforeEach(module('mean'));
    
    var $httpBackend;
    var $controller;
    var $stateParams;
    var ArticleController;
    var ArticlesFactory;

    var mockArticle = {
        _id: 'adfj23nkrlmkkfadfadf2141',
        topic: 'title topic',
        content: 'article content',
        author: {
            username: 'eieiza55plus'
        },
        createdAt: new Date()
    };

    beforeEach(inject(function($injector) {
        $httpBackend       = $injector.get('$httpBackend');
        $controller        = $injector.get('$controller');
        $stateParams        = $injector.get('$stateParams');
        ArticlesFactory    = $injector.get('ArticlesFactory');
        ArticleController = $controller('ArticleController');

        $httpBackend.whenGET(/views.*/).respond(200, '');
    }));

    describe('precondition', function() {
        beforeEach(function() {
            $stateParams.id = mockArticle._id;
        });
        it('should not have articles at first', function() {
            expect(ArticleController.article).toEqual({});
        });

        it('should set article data correctly', function() {
            $httpBackend.expectGET('/api/article/' + mockArticle._id)
                .respond(200, mockArticle);
            $httpBackend.flush();

            expect(ArticleController.article).toEqual(mockArticle);
        })
    });
});