/*global angular,FB */

app.factory('FacebookService', ['$q', 'APP', function ($q, APP) {

    function FacebookService() {

    }

    FacebookService.FB = function () {
        var deferred = $q.defer();
        if (window['FB'] !== undefined) {
            deferred.resolve(window['FB']);
        } else {
            FacebookService.init().then(function (success) {
                deferred.resolve(window['FB']);
            }, function (error) {
                deferred.reject(error);
            })
        }
        return deferred.promise;
    }

    FacebookService.getFacebookMe = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
            facebook.api('/me', { fields: 'id,name,first_name,last_name,email,gender,picture,cover,link' }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
        });
        return deferred.promise;
    };

    FacebookService.getPictureMe = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
            facebook.api('/me/picture', { width: 300, height: 300, type: 'square' }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
        });
        return deferred.promise;
    };

    FacebookService.getLoginStatus = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
            facebook.getLoginStatus(function (response) {
                onFacebookStatus(response, deferred);
            });
        });
        return deferred.promise;
    };

    FacebookService.login = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
            facebook.login(function (response) {
                onFacebookStatus(response, deferred);
            }, {
                scope: 'public_profile,email' // publish_stream,
            });
        });
        return deferred.promise;
    };

    FacebookService.logout = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
			facebook.logout(function (response) {
				deferred.resolve(response);
			});
        });
        return deferred.promise;
    };

    FacebookService.deletePermissions = function () {
        var deferred = $q.defer();
		FacebookService.FB().then(function (facebook) {
			facebook.api('/me/permissions', 'delete', function (response) {
				deferred.resolve(response);
            });
        });
        return deferred.promise;
    };

    FacebookService.init = function () {
        var deferred = $q.defer();
        window.fbAsyncInit = function () {
            FB.init({
                appId: APP.FACEBOOK_APP_ID,
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.5'
            });
            deferred.resolve(FB);
        };
        try {
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    };

    function onFacebookStatus(response, deferred) {
        FacebookService.authResponse = null;
        if (response.status === 'connected') {
            FacebookService.authResponse = response.authResponse;
            deferred.resolve(response);
        } else if (response.status === 'not_authorized') {
            deferred.reject(response);
        } else {
            deferred.reject(response);
        }
    };

    return FacebookService;

}]);

app.factory('Users', ['$q', '$http', '$location', '$timeout', 'APP', 'LocalStorage', 'User', function ($q, $http, $location, $timeout, APP, LocalStorage, User) {

    // PRIVATE VARIABLE FOR CURRENT USER
    var _currentUser = null;

    function Users() {
    }

    Users.prototype = {
    };

    // STATIC CLASS METHODS
    Users.currentUser = function () {
        return _currentUser;
    };

    Users.getCurrentUser = function () {
        var deferred = $q.defer();
        if (_currentUser) {
            deferred.resolve(_currentUser);
        } else {
            $http.get(APP.API + '/api/users/current/').then(function success(response) {
                if (response && response.data) {
                    _currentUser = new User(response.data);
                    deferred.resolve(_currentUser);
                } else {
                    deferred.resolve(null); // deferred.reject(null);
                }
            }, function error(response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;
    };

    Users.isLogged = function () {
        var deferred = $q.defer();
        Users.getCurrentUser().then(function (user) {
            // console.log('Users.isLogged.success', user);
            user && user.isAuthenticated ? deferred.resolve(user) : deferred.reject();
        }, function error(response) {
            // console.log('Users.isLogged.error', data);
            deferred.reject(response);
        })
        return deferred.promise;
    };

    Users.isAdmin = function () {
        var deferred = $q.defer();
        Users.getCurrentUser().then(function (user) {
            user && user.isAuthenticated && user.isAdmin ? deferred.resolve(user) : deferred.reject();
        }, function error(response) {
            deferred.reject(response);
        })
        return deferred.promise;
    };

    Users.isLoggedOrGoTo = function(redirect) {
        var deferred = $q.defer();
        Users.getCurrentUser().then(function (user) {
            // console.log('Users.isLogged.success', user);
            if (user && user.isAuthenticated) {
                deferred.resolve(user);
            } else {
                deferred.reject();
                $location.path(redirect);
            }
        }, function error(response) {
            // console.log('Users.isLogged.error', data);
            deferred.reject(response);
            $location.path(redirect);
        })
        return deferred.promise;
    };

    Users.isAdminOrGoTo = function(redirect) {
        var deferred = $q.defer();
        Users.getCurrentUser().then(function (user) {
            // console.log('Users.isLogged.success', user);
            if (user && user.isAuthenticated && user.isAdmin) {
                deferred.resolve(user);
            } else {
                deferred.reject();
                $location.path(redirect);
            }
        }, function error(response) {
            // console.log('Users.isLogged.error', data);
            deferred.reject(response);
            $location.path(redirect);
        })
        return deferred.promise;
    },

    /** LOGIN METHODS **/
    Users.signup = function (model) {
        var deferred = $q.defer();
        $http.post(APP.API + '/api/users/signup/', model).then(function success(response) {
            _currentUser = new User(response.data);
            deferred.resolve(_currentUser);
        }, function error(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    Users.signin = function (model) {
        var deferred = $q.defer();
        $http.post(APP.API + '/api/users/signin/', model).then(function success(response) {
            _currentUser = new User(response.data);
            deferred.resolve(_currentUser);
        }, function error(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    Users.signInWithFacebook = function (auth) {
        var deferred = $q.defer();
        $http.post(APP.API + '/api/users/signinwithfacebook/', auth).then(function success(response) {
            _currentUser = new User(response.data);
            deferred.resolve(_currentUser);
        }, function error(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    Users.signout = function () {
        var deferred = $q.defer();
        $http.get(APP.API + '/api/users/signout/').then(function success(response) {
            _currentUser = null;
            deferred.resolve(response.data);
        }, function error(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    Users.detail = function (userRoute) {
        var deferred = $q.defer();
        $http.get(APP.API + '/api/users/route/' + userRoute).then(function success(response) {
            deferred.resolve(new User(response.data));
        }, function error(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    return Users;
}]);

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
