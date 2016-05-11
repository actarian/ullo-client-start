/*global angular,FB */

var app = angular.module('ullo', []);

app.controller('TestCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

    $scope.model = {
        label: 'Carica',
    };
    
    $timeout(function() {
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
        $http.get('http://ulloapi.wslabs.it/api/stream/anonymous').then(function(success){
            $scope.items = success.data;
        }, function(error) {
            console.log('error', error);
        });
    };

}]);


/*global angular,dynamics*/

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

/*global angular,FB */

/*global angular,FB,dynamics*/


app.filter('customCurrency', ['$filter', function ($filter) {
    var legacyFilter = $filter('currency');
    return function (cost, currency) {
        return legacyFilter(cost * currency.ratio, currency.formatting);
    }
}]);

app.filter('customSize', ['APP', function (APP) {
    return function (inches) {
        if (APP.unit === APP.units.IMPERIAL) {
            var feet = Math.floor(inches / 12);
            inches = inches % 12;
            inches = Math.round(inches * 10) / 10;
            return (feet ? feet + '\' ' : '') + (inches + '\'\'');
        } else {
            var meters = Math.floor(inches * APP.size.ratio);
            var cm = (inches * APP.size.ratio * 100) % 100;
            cm = Math.round(cm * 10) / 10;
            return (meters ? meters + 'm ' : '') + (cm + 'cm');
        }
    };
}]);

app.filter('customWeight', ['APP', function (APP) {
    return function (pounds) {
        if (APP.unit === APP.units.IMPERIAL) {
            if (pounds < 1) {
                var oz = pounds * 16;
                oz = Math.round(oz * 10) / 10;
                return (oz ? oz + 'oz ' : '');
            } else {
                pounds = Math.round(pounds * 100) / 100;
                return (pounds ? pounds + 'lb ' : '');
            }
        } else {
            var kg = Math.floor(pounds * APP.weight.ratio / 1000);
            var grams = (pounds * APP.weight.ratio) % 1000;
            grams = Math.round(grams * 10) / 10;
            return (kg ? kg + 'kg ' : '') + (grams + 'g');
        }
    };
}]);

app.filter('customNumber', ['$filter', function ($filter) {
    var filter = $filter('number');
    return function (value, precision, unit) {
        unit = unit || '';
        return (value ? filter(value, precision) + unit : '-');
    }
}]);

app.filter('customDate', ['$filter', function ($filter) {
    var filter = $filter('date');
    return function (value, format, timezone) {
        return value ? filter(value, format, timezone) : '-';
    }
}]);

app.filter('customTime', ['$filter', function ($filter) {
    return function (value, placeholder) {
        if (value) {
            return Utils.parseTime(value);
        } else {
            return (placeholder ? placeholder : '-');
        }
    }
}]);

app.filter('customDigital', ['$filter', function ($filter) {
    return function (value, placeholder) {
        if (value) {
            return Utils.parseHour(value);
        } else {
            return (placeholder ? placeholder : '-');
        }
    }
}]);

app.filter('customString', ['$filter', function ($filter) {
    return function (value, placeholder) {
        return value ? value : (placeholder ? placeholder : '-');
    }
}]);

app.filter('customEnum', function () {
    return function (val) {
        val = val + 1;
        return val < 10 ? '0' + val : val;
    };
});

/*global angular,FB */

/*global angular,FB */

/*global angular,FB */

app.factory('Vector', function() {
	function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector.make = function (a, b) {
        return new Vector(b.x - a.x, b.y - a.y);
    };
    Vector.size = function (a) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    };
    Vector.normalize = function (a) {
        var l = Vector.size(a);
        a.x /= l;
        a.y /= l;
        return a;
    };
    Vector.incidence = function (a, b) {
        var angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        // if (angle < 0) angle += 2 * Math.PI;
        // angle = Math.min(angle, (Math.PI * 2 - angle));
        return angle;
    };
    Vector.distance = function (a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    };
    Vector.cross = function (a, b) {
        return (a.x * b.y) - (a.y * b.x);
    };
    Vector.difference = function (a, b) {
        return new Vector(b.x - a.x, b.y - a.y);
    };
    Vector.prototype = {
        size: function () {
            return Vector.size(this);
        },
        normalize: function () {
            return Vector.normalize(this);
        },
        incidence: function (b) {
            return Vector.incidence(this, b);
        },
        cross: function (b) {
            return Vector.cross(this, b);
        },
        towards: function (b, friction) {
            friction = friction || 0.125;
            this.x += (b.x - this.x) * friction;
            this.y += (b.y - this.y) * friction;
            return this;
        },
        add: function (b) {
            this.x += b.x;
            this.y += b.y;
            return this;
        },
        friction: function (b) {
            this.x *= b;
            this.y *= b;
            return this;
        },
        copy: function (b) {
            return new Vector(this.x, this.y);
        },
        toString: function () {
            return '{' + this.x + ',' + this.y + '}';
        },
    };
    return Vector;
});

app.factory('Utils', ['Vector', function (Vector) {
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                       || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());

    var transformProperty = function detectTransformProperty() {
        var transformProperty = 'transform',
            safariPropertyHack = 'webkitTransform';
		var div = document.createElement("DIV");
        if (typeof div.style[transformProperty] !== 'undefined') {
            ['webkit', 'moz', 'o', 'ms'].every(function(prefix) {
                var e = '-' + prefix + '-transform';
                if (typeof div.style[e] !== 'undefined') {
                    transformProperty = e;
                    return false;
                }
                return true;
            });
        } else if (typeof div.style[safariPropertyHack] !== 'undefined') {
            transformProperty = '-webkit-transform';
        } else {
            transformProperty = undefined;
        }
        return transformProperty;
    } ();

    var _isTouch;
    function isTouch() {
        if (!_isTouch) {
            _isTouch = {
                value: ('ontouchstart' in window || 'onmsgesturechange' in window)
            }
        }
        // console.log(_isTouch);
        return _isTouch.value;
    }

    function getTouch(e, previous) {
        var t = new Vector();
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            var touch = null;
            var event = e.originalEvent ? e.originalEvent : e;
            var touches = event.touches.length ? event.touches : event.changedTouches;
            if (touches && touches.length) {
                touch = touches[0];
            }
            if (touch) {
                t.x = touch.pageX;
                t.y = touch.pageY;
            }
        } else if (e.type == 'click' || e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
            t.x = e.pageX;
            t.y = e.pageY;
        }
        if (previous) {
            t.s = Vector.difference(previous, t);
        }
        t.type = e.type;
        return t;
    }

    function getRelativeTouch(element, point) {
        var rect = element[0].getBoundingClientRect();
        var e = new Vector(rect.left,  rect.top);
        return Vector.difference(e, point);
    }

    function getClosest(el, selector) {
        var matchesFn, parent;
        ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
            if (typeof document.body[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        });
        while (el !== null) {
            parent = el.parentElement;
            if (parent !== null && parent[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }
        return null;
    }


    var getNow = Date.now || function() {
        return new Date().getTime();
    };

    function throttle(func, wait, options) {
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : getNow();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = getNow();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    var Style = function() {
        function Style() {
            this.props = {
                scale: 1,
                hoverScale: 1,
                currentScale: 1,
            }
        }
        Style.prototype = {
            set: function (element) {
                var styles = [];
                angular.forEach(this, function (value, key) {
                    if (key !== 'props')
                        styles.push(key + ':' + value);
                });
                element.style.cssText = styles.join(';') + ';';
            },
            transform: function (transform) {
                this[Utils.transformProperty] = transform;
            },
            transformOrigin: function (x, y) {
                this[Utils.transformProperty + '-origin-x'] = (Math.round(x * 1000) / 1000) + '%';
                this[Utils.transformProperty + '-origin-y'] = (Math.round(y * 1000) / 1000) + '%';
            },
        };
        return Style;
    }();

    function Utils() {
    }

	Utils.transformProperty = transformProperty;
    Utils.getTouch = getTouch;
    Utils.getRelativeTouch = getRelativeTouch;
    Utils.getClosest = getClosest;
    Utils.throttle = throttle;
    Utils.Style = Style;

    return Utils;
}]);

/*global angular*/

app.factory('WebWorker', ['$q', '$http', function ($q, $http) {
    var isWebWorkerSupported = (typeof (Worker) !== "undefined");
    if (!isWebWorkerSupported) {
        window.Worker = function () {
            function Worker(src) {
                var self = this;
                $http.get(src, { transformResponse: function (d, h) { return d } }).then(function success(response) {
                    try {
                        eval('self.o = function(){ function postMessage(e) { self.onmessage({data:e}); }\n ' + response.data + ' };');
                        self.object = new self.o();
                        self.object.postMessage = function (e) {
                            self.onmessage({data:e});
                        }
                    } catch(e) {
                        console.log("Worker error ", e);
                    }
                }, function error(response) {
                    console.log("Worker not found");
                });
            }
            Worker.prototype = {
                onmessage: function (e) {
                    console.log('Worker not implemented');
                },
                postMessage: function (e) {
                    this.object.onmessage({ data: e });
                }
            }
            return Worker;
        } ();
    }
    function WebWorker(src) {
        var self = this;
        this.callbacks = {};
        this.id = 0;
        this.worker = new Worker(src);
        this.worker.onmessage = function (e) {
            self.onmessage(e);
        };
    }
    WebWorker.prototype = {
        parse: function (e) {
            return JSON.parse(e.data);
        },
        stringify: function (data) {
            return JSON.stringify(data);
        },
        onmessage: function (e) {
            var data = this.parse(e);
            var deferred = this.callbacks[data.id];
            if (data.status !== -1) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
            delete this.callbacks[data.id];
        },
        post: function (data) {
            var deferred = $q.defer();
            data.id = this.id;
            this.callbacks[this.id.toString()] = deferred;
            this.id++;
            this.worker.postMessage(this.stringify(data));
            return deferred.promise;
        },
    };
    WebWorker.isSupported = isWebWorkerSupported;
    return WebWorker;
}]);

app.factory('$httpAsync', ['$q', '$http', function ($q, $http) {
    var isWebWorkerSupported = (typeof (Worker) !== "undefined");
    if (!isWebWorkerSupported) {
        return $http;
    }
    var worker = new Worker('/js/workers/http.min.js');
    var callbacks = {};
    var id = 0;
    var lowercase = function (string) { return isString(string) ? string.toLowerCase() : string; };
    var trim = function (value) {
        return isString(value) ? value.trim() : value;
    };
    function $httpAsync(options) {
        var deferred = $q.defer();
        var wrap = getDefaults(options);
        wrap.id = id.toString();
        console.log('wrap', wrap);
        callbacks[wrap.id] = deferred;
        id++;
        worker.postMessage($httpAsync.stringify(wrap));
        return deferred.promise;
    }
    $httpAsync.get = function (url, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'GET',
            url: url
        }));
    };
    $httpAsync.delete = function (url, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'DELETE',
            url: url
        }));
    };
    $httpAsync.head = function (url, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'HEAD',
            url: url
        }));
    };
    $httpAsync.post = function (url, data, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'POST',
            data: data,
            url: url
        }));
    };
    $httpAsync.put = function (url, data, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'PUT',
            data: data,
            url: url
        }));
    };
    $httpAsync.patch = function (url, data, config) {
        return $httpAsync(angular.extend({}, config || {}, {
            method: 'PATCH',
            data: data,
            url: url
        }));
    };
    $httpAsync.parse = function (e) {
        return JSON.parse(e.data);
    };
    $httpAsync.stringify = function (data) {
        return JSON.stringify(data);
    };
    $httpAsync.isSupported = isWebWorkerSupported;
    worker.onmessage = function (e) {
        var wrap = $httpAsync.parse(e);
        console.log('onmessage', wrap);
        var deferred = callbacks[wrap.id];
        var status = wrap.status >= -1 ? wrap.status : 0;
        var getter = headersGetter(wrap.response.headers);
        (isSuccess(status) ? deferred.resolve : deferred.reject)({
            data: wrap.response.data, // !!!! JSON.parse(wrap.response.data),
            headers: getter,
            status: wrap.response.status,
            statusText: wrap.response.statusText,
            config: wrap.config,
        });
        delete callbacks[wrap.id];
    }
    return $httpAsync;
    function isSuccess(status) {
        return 200 <= status && status < 300;
    }
    function createMap() {
        return Object.create(null);
    }
    function isString(value) { return typeof value === 'string'; }
    function parseHeaders(headers) {
        var parsed = createMap(), i;
        function fillInParsed(key, val) {
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }
        if (isString(headers)) {
            var a = headers.split('\n');
            for (var j = 0; j < a.length; j++) {
                var line = a[j];
                i = line.indexOf(':');
                fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
            }
        } else if (isObject(headers)) {
            for (var p in headers) {
                fillInParsed(lowercase(p), trim(headers[p]));
            }
        }
        return parsed;
    }
    function headersGetter(headers) {
        var headersObj;
        return function (name) {
            if (!headersObj) headersObj = parseHeaders(headers);
            if (name) {
                var value = headersObj[lowercase(name)];
                if (value === void 0) {
                    value = null;
                }
                return value;
            }
            return headersObj;
        };
    }
    function getDefaults(options) {
        var defaults = {
            method: 'GET',
            withCredentials: false,
            responseType: 'json',
            headers: {},
            config: {}
        }
        defaults.withCredentials = $http.defaults.withCredentials;
        angular.extend(defaults.headers, $http.defaults.headers.common);
        var method = (options.method || defaults.method).toLowerCase();
        if ($http.defaults.headers[method]) {
            angular.extend(defaults.headers, $http.defaults.headers[method]);
        }
        console.log('defaults', $http.defaults);
        // defaults = angular.extend(defaults, $http.defaults);
        /*
    method{string}:                     HTTP method (e.g. 'GET', 'POST', etc)
    url:{string}:                       Absolute or relative URL of the resource that is being requested.
    params:{Object.<string|Object>}:    Map of strings or objects which will be serialized with the paramSerializer and appended as GET parameters.

    data:{string|Object}:               Data to be sent as the request message data.
    headers:{Object}:                   Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent. Functions accept a config object as an argument.

    xsrfHeaderName:{string}:            Name of HTTP header to populate with the XSRF token.
    xsrfCookieName:{string}:            Name of cookie containing the XSRF token.
    transformRequest:{function(data, headersGetter)|Array.<function(data, headersGetter)>}:         transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations

    transformResponse:{function(data, headersGetter, status)|Array.<function(data, headersGetter, status)>}:    transform function or an array of such functions. The transform function takes the http response body, headers and status and returns its transformed (typically deserialized) version. See Overriding the Default TransformationjqLiks

    paramSerializer:{string|function(Object<string,string>):string}:        A function used to prepare the string representation of request parameters (specified as an object). If specified as string, it is interpreted as function registered with the $injector, which means you can create your own serializer by registering it as a service. The default serializer is the $httpParamSerializer; alternatively, you can use the $httpParamSerializerJQLike

    cache:{boolean|Cache}:              If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.

    timeout:{number|Promise}:           timeout in milliseconds, or promise that should abort the request when resolved.
    withCredentials:{boolean}:          whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.

    responseType:{string}:              see XMLHttpRequest.responseType.
        */
        options ? options = angular.extend(defaults, options) : defaults;
        return options;
    }
}]);
