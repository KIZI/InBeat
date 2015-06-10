var App = angular.module('InBeatDocs', ['ngStorage']);

/*
 ==================================================================================================
 Main controller + config
 ==================================================================================================
 */
App.controller('MainCtrl', ['$scope', '$http', 'Base64','$sessionStorage',function($scope, $http, Base64, $sessionStorage) {
    $scope.accountId = $sessionStorage.accountId?$sessionStorage.accountId:"";
    $scope.username = $sessionStorage.username?$sessionStorage.username:"";
    $scope.password = $sessionStorage.password?$sessionStorage.password:"";
    $scope.userId = $sessionStorage.userId?$sessionStorage.userId:"";
    $scope.objectId = $sessionStorage.objectId?$sessionStorage.objectId:"";

    $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.username + ':' + $scope.password);
    $scope.$watch('username', function(newValue, oldValue) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(newValue + ':' + $scope.password);
        $sessionStorage.username = newValue;
    });
    $scope.$watch('password', function(newValue, oldValue) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.username + ':' + newValue);
        $sessionStorage.password = newValue;
    });
    $scope.$watch('accountId', function(newValue, oldValue) {
        $sessionStorage.accountId = newValue;
    });

    $scope.$watch('userId', function(newValue, oldValue) {
        $sessionStorage.userId = newValue;
    });

    $scope.$watch('objectId', function(newValue, oldValue) {
        $sessionStorage.objectId = newValue;
    });

    $scope.prettyPrint = function(data) {
        if(typeof(data)==="string") {
            return data;
        } else {
            return JSON.stringify(data, null, 4);
        }
    };

    $scope.output = function(data, status, headers, config) {
        $scope.result = $scope.prettyPrint(data);
        $scope.connection = $scope.prettyPrint(status)+"\n"+$scope.prettyPrint(headers)+"\n"+$scope.prettyPrint(config);
    };

    $scope.clear = function(){
        $scope.result = "";
        $scope.connection = "";
    };

}]);


App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/main', {
                templateUrl: 'templates/main.html'
            }).
            when('/gain-account', {
                templateUrl: 'templates/gain-account.html',
                controller: 'gain-account'
            }).
            when('/gain-aggregation-rules', {
                templateUrl: 'templates/gain-aggregation-rules.html',
                controller: 'gain-aggregation-rules'
            }).
            when('/gain-aggregation-taxonomy', {
                templateUrl: 'templates/gain-aggregation-taxonomy.html',
                controller: 'gain-aggregation-taxonomy'
            }).
            when('/gain-adminAccount', {
                templateUrl: 'templates/gain-adminAccount.html',
                controller: 'gain-adminAccount'
            }).
            when('/gain-listener', {
                templateUrl: 'templates/gain-listener.html',
                controller: 'gain-listener'
            }).
            when('/gain-interaction', {
                templateUrl: 'templates/gain-interaction.html',
                controller: 'gain-interaction'
            }).
            when('/gain-session', {
                templateUrl: 'templates/gain-session.html',
                controller: 'gain-session'
            }).
            when('/gain-export', {
                templateUrl: 'templates/gain-export.html',
                controller: 'gain-export'
            }).
            when('/gain-description', {
                templateUrl: 'templates/gain-description.html',
                controller: 'gain-description'
            }).
            when('/pl-data', {
                templateUrl: 'templates/pl-data.html',
                controller: 'pl-data'
            }).
            when('/pl-rule', {
                templateUrl: 'templates/pl-rule.html',
                controller: 'pl-rule'
            }).
            when('/rs-rule', {
                templateUrl: 'templates/rs-rule.html',
                controller: 'rs-rule'
            }).
            when('/rs-classification', {
                templateUrl: 'templates/rs-classification.html',
                controller: 'rs-classification'
            }).
            otherwise({
                redirectTo: '/main'
            });
    }]);

App.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');

    var spinnerFunction = function spinnerFunction(data, headersGetter) {
        $("#spinner").show();
        return data;
    };

    $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

App.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            $("#spinner").hide();
            return response;
        }, function (response) {
            $("#spinner").hide();
            return $q.reject(response);
        });
    };
});

/*
 ==================================================================================================
 Controllers
 ==================================================================================================
 */

App.controller('gain-account', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.get = function(){
        $http.get('/gain/api/'+$scope.accountId).success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.update = function(){
        $http.put('/gain/api/'+$scope.accountId,$scope.source).success($scope.output).error($scope.output);
    };
    $scope.get();
}]);


App.controller('gain-adminAccount', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.getDefault = function(){
        $http.get('files/gain-admin-account.json').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.get = function(){
        $http.get('/gain/api/admin/account').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.update = function(){
        $http.put('/gain/api/admin/account',$scope.source).success($scope.output).error($scope.output);
    };
    $scope.get();
}]);

App.controller('gain-aggregation-rules', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.getDefault = function(){
        $http.get('files/gain-aggregation-rules.js').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.get = function(){
        $http.get('/gain/api/'+$scope.accountId+'/aggregation/rules').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.update = function(){
        $http.put('/gain/api/'+$scope.accountId+'/aggregation/rules',{body:$scope.source}).success($scope.output).error($scope.output);
    };
    $scope.get();
}]);

App.controller('gain-aggregation-taxonomy', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.getDefault = function(){
        $http.get('files/gain-aggregation-taxonomy.json').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.get = function(){
        $http.get('/gain/api/'+$scope.accountId+'/aggregation/taxonomy').success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
    $scope.update = function(){
        $http.put('/gain/api/'+$scope.accountId+'/aggregation/taxonomy',{body:$scope.source}).success($scope.output).error($scope.output);
    };
    $scope.get();
}]);

App.controller('gain-listener', ['$scope','$http',function($scope,$http) {
    $http.get('files/gain-listener.json').success(function(data, status, headers, config) {
        $scope.orig = data;
        $scope.orig.accountId = $scope.accountId;
        $scope.source = $scope.prettyPrint($scope.orig);
    });
    $scope.$watch('accountId', function(newValue, oldValue) {
        if($scope.orig) {
            $scope.orig.accountId = newValue;
            $scope.source = $scope.prettyPrint($scope.orig);
        }
    });
    $scope.clear();
    $scope.send = function(){
        $http.post('/gain/listener', $scope.source).success($scope.output).error($scope.output);
    };
}]);

App.controller('gain-interaction', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.all = function(){
        $http.get('/gain/api/'+$scope.accountId+'/interaction'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
    $scope.delete = function(){
        $http.put('/gain/api/'+$scope.accountId+'/interaction'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
    $scope.number = function(){
        $http.get('/gain/api/'+$scope.accountId+'/interaction/number'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
}]);

App.controller('gain-session', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.number = function(){
        $http.get('/gain/api/'+$scope.accountId+'/session/number'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
}]);

App.controller('gain-export', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.all = function(contentType){
        var config = {headers:{"Accept": contentType}};
        $http.get('/gain/api/'+$scope.accountId+'/export/interests'+($scope.userId?("?uid="+$scope.userId):""),config).success($scope.output).error($scope.output);
    };
    $scope.delete = function(){
        $http.put('/gain/api/'+$scope.accountId+'/export/interests'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
}]);

App.controller('gain-description', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.description = function(){
        $http.get('/gain/api/'+$scope.accountId+'/object/attributes'+($scope.objectId?("?id="+$scope.objectId):"")).success($scope.output).error($scope.output);
    };
    $scope.delete = function(){
        $http.put('/gain/api/'+$scope.accountId+'/object/attributes'+($scope.objectId?("?id="+$scope.objectId):"")).success($scope.output).error($scope.output);
    };
    $scope.taxonomy = function(){
        $http.get('/gain/api/'+$scope.accountId+'/object/taxonomies'+($scope.objectId?("?id="+$scope.objectId):"")).success($scope.output).error($scope.output);
    };
    $scope.flattaxonomy = function(){
        $http.get('/gain/api/'+$scope.accountId+'/object/flattaxonomies'+($scope.objectId?("?id="+$scope.objectId):"")).success($scope.output).error($scope.output);
    };
    $scope.upsert = function(){
        $http.post('/gain/api/'+$scope.accountId+'/object/attributes', $scope.source).success($scope.output).error($scope.output);
    };
    $http.get('files/gain-description.json').success(function(data, status, headers, config) {
        $scope.orig = data;
        for(var item in $scope.orig){
            $scope.orig[item].accountId = $scope.accountId;
        }
        $scope.source = $scope.prettyPrint($scope.orig);
    });
    $scope.$watch('accountId', function(newValue, oldValue) {
        if($scope.orig) {
            for(var item in $scope.orig){
                $scope.orig[item].accountId = newValue;
            }
            $scope.source = $scope.prettyPrint($scope.orig);
        }
    });
}]);


App.controller('pl-rule', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.mine = function(){
        var param = {type: "easyminer", support: ($scope.support && $scope.support!="")?parseFloat($scope.support):0.01, confidence: ($scope.confidence && $scope.confidence!="")?parseFloat($scope.confidence):0.01, className: ($scope.className && $scope.className!="")?$scope.className:"interest"};
        $http.put('/pl/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):""),param).success($scope.output).error($scope.output);
    };
    $scope.mine2 = function(){
        var param = {type: "arules", support: ($scope.support && $scope.support!="")?parseFloat($scope.support):0.01, confidence: ($scope.confidence && $scope.confidence!="")?parseFloat($scope.confidence):0.01, className: ($scope.className && $scope.className!="")?$scope.className:"interest"};
        $http.put('/pl/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):""),param).success($scope.output).error($scope.output);
    };
    $scope.mine3 = function(){
        var param = {type: "jsapriori", support: ($scope.support && $scope.support!="")?parseFloat($scope.support):0.01, confidence: ($scope.confidence && $scope.confidence!="")?parseFloat($scope.confidence):0.01, className: ($scope.className && $scope.className!="")?$scope.className:"interest"};
        $http.put('/pl/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):""),param).success($scope.output).error($scope.output);
    };
    $scope.get = function(){
        $http.get('/pl/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):"")).success($scope.output).error($scope.output);
    };
}]);


App.controller('pl-data', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.upload = function(){
        $http.put('/pl/api/'+$scope.accountId+'/data'+($scope.userId?("?uid="+$scope.userId):""),$scope.source).success($scope.output).error($scope.output);
    };
    $scope.load = function(){
        $http.get('/gain/api/'+$scope.accountId+'/export/interests'+($scope.userId?("?uid="+$scope.userId):"")).success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
}]);

App.controller('rs-rule', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.upload = function(){
        $http.put('/rs/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):""),$scope.source).success($scope.output).error($scope.output);
    };
    $scope.load = function(){
        $http.get('/pl/api/'+$scope.accountId+'/rules'+($scope.userId?("?uid="+$scope.userId):"")).success(function(data, status, headers, config) {
            $scope.output(data, status, headers, config);
            $scope.source = $scope.prettyPrint(data);
        }).error($scope.output);
    };
}]);

App.controller('rs-classification', ['$scope','$http',function($scope,$http) {
    $scope.clear();
    $scope.classify = function(){
        $http.put('/rs/api/'+$scope.accountId+'/classification'+($scope.userId?("?uid="+$scope.userId):"")+"&"+($scope.objectId?("id="+$scope.objectId):""),$scope.source?$scope.source:null).success($scope.output).error($scope.output);
    };
}]);


/*
 ==================================================================================================
 Others
 ==================================================================================================
 */


App.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});