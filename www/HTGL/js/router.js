/**
 * kcjb Module
 *
 * Description
 */


var app = angular.module('kcjb', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/');
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                controller: function($scope, $http) {
                    $http.get('/api/profile/').success(function(data) {
                        console.log("get", data);
                        $scope.user = data;
                    })
                    $scope.profileForm = function() {
                        $http.post('profile.php', $scope.user)
                            .success(function() {
                                alert("提交成功");

                            })
                    };
                },
            })
            .state('spread', {
                url: '/spread',
                templateUrl: 'spread.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            })
            .state('score', {
                url: '/score',
                templateUrl: 'score.html',
                controller: function($scope, $http) {
                    // $http.get('res/score.json').success(function(data) {
                    $scope.items = [{
                        time: "20134-2",
                        client: "dfdfd",
                        giftNumber: "dfdfd",
                        giftPoint: "dfdfd",
                        giftCount: "dfdfd",
                        totalPoint: "dfdfd"
                    }, {
                        time: "20134-2",
                        client: "dfdfd",
                        giftNumber: "dfdfd",
                        giftPoint: "dfdfd",
                        giftCount: "dfdfd",
                        totalPoint: "dfdfd"
                    }, {
                        time: "20134-2",
                        client: "dfdfd",
                        giftNumber: "dfdfd",
                        giftPoint: "dfdfd",
                        giftCount: "dfdfd",
                        totalPoint: "dfdfd"
                    }, {
                        time: "20134-2",
                        client: "dfdfd",
                        giftNumber: "dfdfd",
                        giftPoint: "dfdfd",
                        giftCount: "dfdfd",
                        totalPoint: "dfdfd"
                    }];
                    // })
                    $scope.scoreForm = function() {
                        $http.post('profile.php', $scope.score)
                            .success(function() {
                                alert("提交成功");

                            })
                    };



                }

            })
            .state('userlist', {
                url: '/userlist',
                templateUrl: 'userlist.html',
                controller: function($scope, $http) {
                    // $http.get('/api/user').success(function(data){
                    //     $scope.userlist = data;
                    //     console.log("get user success",$scope.userlist);
                    // });                   
                    // $("table").dataTable({
                    //     "ajax": '/api/user',
                    //     "columns": $scope.userlist
                        
                    // });
            $http.get('res/profile.json').success(function(data) {
                            console.log(data);
                            $scope.user = data;
                        })
                    console.log("userlist", $scope);
                    // $scope.id = $("tr").find('.selected').cells[0].innerHTML;
                    $scope.getInfo = function(id) {
                        console.log("scope",id);


                    };
                    $scope.delete=function(id){
                        $http.post('/api/profile/')
                    }
                        
                    $scope.userlistForm = function() {
                        $http.post('/api/profile/', $scope.user)
                            .success(function() {
                                alert("提交成功");

                            })
                    };
                }
            }).state('unuser', {
                url: '/unuser',
                templateUrl: 'unuser.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('blacklist', {
                url: '/blacklist',
                templateUrl: 'blacklist.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('warning', {
                url: '/warning',
                templateUrl: 'warning.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('table', {
                url: '/table',
                templateUrl: 'table.html'
                    // controller: function($scope, $http) {
                    //     $http.get('res/spread.json').success(function(data) {
                    //         $scope.spread = data;
                    //     })
                    // }
            }).state('prosel', {
                url: '/prosel',
                templateUrl: 'prosel.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('profix', {
                url: '/profix',
                templateUrl: 'profix.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('price', {
                url: '/price',
                templateUrl: 'price.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('handan', {
                url: '/handan',
                templateUrl: 'handan.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            })
    }
])
