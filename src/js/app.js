/*global angular,FB */

var app = angular.module('ullo', ['ngRoute', 'ngAnimate', 'ngMessages', 'relativeDate', 'ngFileUpload']);

/*
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
        isForward: true
        
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
        isForward: true
        
    });
    
    $routeProvider.otherwise('/404');
    
    // HTML5 MODE url writing method (false: #/anchor/use, true: /html5/url/use)
    $locationProvider.html5Mode(true);
    
}]);
*/