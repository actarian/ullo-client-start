/*global angular,FB */

var app = angular.module('ullo', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

	$routeProvider.when('/', {                
        controller: 'SignInCtrl',
        templateUrl: 'templates/signin-test.html',
        title: 'Sign In',
        
    }).when('/signin', {                
        controller: 'SignInCtrl',
        templateUrl: 'templates/signin-test.html',
        title: 'Sign In',
        
    }).when('/stream', {        
        controller: 'TestCtrl',
        templateUrl: 'templates/test.html',
        title: 'TestCtrl',
        
    }).when('/dishes/:dishId', {        
        controller: 'TestCtrl',
        templateUrl: 'templates/test.html',
        title: 'Dishes',
        
    }).when('/test', {                
        controller: 'TestCtrl',
        templateUrl: 'templates/temp.html',
        title: 'HomePage',
        
    }).when('/404', {
        controller: 'TestCtrl',
        templateUrl: 'templates/test.html',
        title: 'Errore 404',
        
    });
    
    $routeProvider.otherwise('/404');
    
    // HTML5 MODE url writing method (false: #/anchor/use, true: /html5/url/use)
    $locationProvider.html5Mode(true);
    
}]);

app.controller('SignInCtrl', ['$scope', '$timeout', '$http', '$location', function ($scope, $timeout, $http, $location) {

    $scope.model = {};

    $scope.signin = function () {
        $scope.signinFormError = null;
        $scope.signinFormBusy = true;
        $timeout(function() {
            $http.post('http://ulloapi.wslabs.it/api/users/signin', $scope.model).then(function(success) {
                console.log('signin', success);
                $location.path('/stream');
            }, function(error) {
                console.log('error', error);
                $scope.signinFormError = { message: error.message };
            }).finally(function() {
                $timeout(function() {
                    $scope.signinFormBusy = false;
                }, 3000);
            });
        }, 1000);
    };
    
}]);
    
app.controller('TestCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

    $scope.model = {
        label: 'Carica',
    };
        
    setTimeout(function() {
        $scope.model.label = 'Carica Stream';
    }, 1000);

    $scope.item = {
        id: 117,
        user: {
            userName: 'Fabio Ottaviani',
            facebookId: '10153341954226947',
            route: 'fabio-ottaviani'
        },
        dish: {
            price: 5,
            isVeganFriendly: false,
            yes: 1,
            no: 0,
            created: '2016-04-27T19:13:45.497',
            vote: {
                dishId: 19,
                like: true,
                created: '2016-04-27T19:14:00.497'
            },
            categories: [
                {
                    id: 2,
                    name: 'Piadine',
                    key: 'piadine'
                }
            ],
            id: 19,
            name: 'Pizza Margherita',
            key: 'pizzaMargherita'
        },
        picture: {
            guid: '8fe99743-4ed3-46de-ba13-2c1bd7a45ffe',
            created: '2016-04-27T19:13:41.02',
            id: 20,
            name: '8fe99743-4ed3-46de-ba13-2c1bd7a45ffe',
            route: '/Media/Files/8fe99743-4ed3-46de-ba13-2c1bd7a45ffe.jpg',
            key: '8Fe997434Ed346DeBa132C1bd7a45ffe'
        },
        created: '2016-04-27T19:13:45.497'
    };
    
    $scope.loadStream = function() {
        $http.get('http://ulloapi.wslabs.it/api/stream/anonymous').then(function(response){
            $scope.items = response.data;
        }, function(error) {
            console.log('error', error);
        });
    };

}]);

