/**
 * the public file to define banner、filter、service..
 */
angular.module("app",[])
    .controller('HomeController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {

            }])
    .controller('SpiderController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.resultTip = "";
                $scope._resetForm = function() {
                    $(".sp_url").val("");
                    $(".sp_name").val();
                }
                $scope.add = function() {
                    var url = $(".sp_url").val();
                    var name = $(".sp_name").val();
                    if (url.length == 0 || name.length == 0) {
                        alert("提交不完整");
                    }

                    var data = {"url":url,"title":name};
                    $http.post("/@addWeb", data).then(function(res) {
                        console.log("print::" + JSON.stringify(res));
                        if (res.data && res.data._STATE_ == "200") {
                            $scope.resultTip = res.data.MSG;
                            $scope._resetForm();
                        }
                    });
                }
    }])
    .controller('SetController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.resultTip = "";
                $scope._resetForm = function() {
                    $(".sp_url").val("");
                    $(".sp_name").val();
                }
                $scope.add = function() {
                    var url = $(".sp_url").val();
                    if (url.length == 0) {
                        alert("提交不完整");
                    }

                    var data = {"src":url};
                    $http.post("/@rss", data).then(function(res) {
                        console.log("print::" + JSON.stringify(res));
                        if (res.data && res.data._STATE_ == "200") {
                            $scope.resultTip = res.data.MSG;
                            $scope._resetForm();
                        }
                    });
                }
    }]);

