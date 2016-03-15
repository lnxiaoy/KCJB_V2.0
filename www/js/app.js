/**
 * app Module
 *
 * Description
 */
// var __info;
angular.module('app', []).controller('week', ['$scope', function($scope) {
        $scope.items = [{
            name: 'yy',
            pro: 4,
            rate: 80,
            money: 229
        }, {
            name: 'sfddy',
            pro: 2,
            rate: 50,
            money: 278
        }, {
            name: 'ysdfy',
            pro: 6,
            rate: 80,
            money: 789
        }];
    }]).controller('lastweek', ['$scope', function($scope) {
        $scope.items = [{
            name: 'yy',
            pro: 4,
            rate: 80,
            money: 229
        }, {
            name: 'sfddy',
            pro: 8,
            rate: 50,
            money: 278
        }, {
            name: 'ysdfy',
            pro: 5,
            rate: 80,
            money: 789
        }];
    }]).controller('month', ['$scope', function($scope) {
        $scope.items = [{
            name: 'yy',
            pro: 4,
            rate: 80,
            money: 229
        }, {
            name: 'sfddy',
            pro: 8,
            rate: 50,
            money: 278
        }, {
            name: 'ysdfy',
            pro: 5,
            rate: 80,
            money: 789
        }];
    }]).controller('all', ['$scope', function($scope) {
        $scope.items = [{
            name: 'yy',
            pro: 14,
            rate: 80,
            money: 2129
        }, {
            name: 'sfddy',
            pro: 18,
            rate: 50,
            money: 1278
        }, {
            name: 'ysdfy',
            pro: 15,
            rate: 80,
            money: 1789
        }, {
            name: 'd',
            pro: 12,
            rate: 80,
            money: 1789
        }, {
            name: 'tt',
            pro: 11,
            rate: 80,
            money: 1769
        }];
    }]).controller('login', ['$scope', '$http', function($scope, $http) {
        $scope.loginForm = function() {
            console.log($scope.user);
            $http.post('/api/login', $scope.user)
                .success(function(data) {
                    // alert("提交成功");
                    // 跳转
                    console.log(data);
                    // alert(data.msg);
                    if (data.succ == 0) {
                        window.location.href = "/index.html";
                    } else {
                        alert(data.msg);
                    }

                })
        }


    }]).controller('logup', ['$scope', '$http', function($scope, $http) {
        $scope.logupForm = function() {
            console.log($scope.user);
            $http.post('/api/regist', $scope.user)
                .success(function(data) {
                    if (data.succ == 0) {
                        alert("注册成功，请登录！");
                        $scope.user =  null;
                    } else {
                        alert(data.msg);
                    }

                })
        }

    }]).controller('change_pass', ['$scope', '$http', function($scope, $http) {
        $scope.changeForm = function() {
            console.log($scope.change);
            $http.post('/api/change_pass', $scope.change)
                .success(function(data) {
                    alert(data.msg);
                })
        }

    }])
    // .controller('info', ['$scope','$http', function($scope, $http) {
    //     $http.get('/api/info').success(function(data){
    //         console.log(data.display);
    //  if (data.succ!==0) {
    //      window.location.href='/login.html';
    //  } else {
    //      __info = data;
    //      $("#userddd").text(data.display);
    //  }
    //     })
    // }])
