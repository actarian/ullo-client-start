/*global angular,FB */

var LESSON = true;
var CONFIG = {
    CLIENT: window.location.href.indexOf('http://ulloclient.wslabs.it') === 0 ? 'http://ulloclient.wslabs.it' : 'http://dev.ullowebapp:8081',
    API: (LESSON || window.location.href.indexOf('http://ulloclient.wslabs.it') === 0) ? 'http://ulloapi.wslabs.it' : 'https://localhost:44302',
    FACEBOOK_APP_ID: window.location.href.indexOf('http://ulloclient.wslabs.it') === 0 ? '1054303094614120' : '1062564893787940',
    assetTypeEnum: {
        Unknown: 0,
        Picture: 1,
    },
    IOS: (navigator.userAgent.match(/iPad|iPhone|iPod/g) ? true : false),
};

app.constant('APP', CONFIG);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

	// SECURE ROUTING
    $routeProvider.when('/stream', {
        title: 'Stream',
        templateUrl: 'templates/stream.html',
        controller: 'StreamCtrl',
        controllerAs: 'streamCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },

    }).when('/dishes/:dishId', {
        title: 'Dish',
        templateUrl: 'templates/dish.html',
        controller: 'DishCtrl',
        controllerAs: 'dishCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },
        isForward: true,

    }).when('/categories/:categoryId', {
        title: 'Category',
        templateUrl: 'templates/category.html',
        controller: 'CategoryCtrl',
        controllerAs: 'categoryCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },
        isForward: true,

    }).when('/users/:userRoute', {
        title: 'User',
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl',
        controllerAs: 'userCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },
        isForward: true,

    }).when('/post', {
        title: 'Add Post',
        templateUrl: 'templates/post.html',
        controller: 'PostCtrl',
        controllerAs: 'postCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },
        isForward: true,

    }).when('/settings', {
        title: 'Settings',
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settingsCtrl',
        resolve: {
            user: ['Users', function(Users){
                return Users.isLoggedOrGoTo('/splash');
            }]
        },
        isForward: true,

	// UNSECURE ROUTING
    }).when('/splash', {
        title: 'Splash',
        templateUrl: 'templates/splash.html',
        controller: 'SplashCtrl',
        controllerAs: 'splashCtrl',

    }).when('/signin', {
        title: 'Sign In',
        templateUrl: 'templates/signin.html',
        controller: 'SigninCtrl',
        controllerAs: 'signinCtrl',

    }).when('/signup', {
        title: 'Sign Up',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signupCtrl',

    }).when('/test', {
        title: 'Test',
        templateUrl: 'templates/dishes.html',
        controller: 'TestCtrl',
        controllerAs: 'testCtrl',

    }).when('/404', {

        title: 'Error 404',
        templateUrl: '404.html',

    });

    $routeProvider.otherwise('/stream');

    // HTML5 MODE url writing method (false: #/anchor/use, true: /html5/url/use)
    $locationProvider.html5Mode(true);

}]);

app.config(['$httpProvider', function ($httpProvider) {
    
    $httpProvider.defaults.withCredentials = true;
    
}]);
