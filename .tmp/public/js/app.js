/**
 * the public file to define banner、filter、service..
 */
angular.module("app",[])
    .controller('HomeController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {

            }])
    .controller('NavController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.userName = "";
                $scope.loginState = false;
                function getCookie(key) {
                    var appStr = $.cookie("__clh");
                    if (appStr) {
                        appStr = JSON.parse(appStr);
                        return appStr[key];
                    }
                }
                $scope._initUser = function() {
                    $scope.userName = getCookie("nick");
                    if ($scope.userName && $scope.userName.length > 0) {
                        $scope.loginState = true;
                    }
                }
                $scope._initUser();
                $scope.logout = function() {
                    $.removeCookie("__clh",{"path":"/"});
                    window.location.href = "/";
                }
                $scope.submit = function() {
                    if ($scope.loginState) {
                        window.location.href = "/submit";
                    } else {
                        window.location.href = "/login";
                    }
                }
            }])
    .controller('SpiderController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.resultTip = "";
                $scope._resetForm = function() {
                    $(".sp_url").val("");
                    $(".sp_name").val("");
                }
                function getCookie(key) {
                    var appStr = $.cookie("__clh");
                    if (appStr) {
                        appStr = JSON.parse(appStr);
                        return appStr[key];
                    }
                }
                function checkeURL(URL){
                    var str=URL;
                    //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
                    //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
                    //下面的代码中应用了转义字符"\"输出一个字符"/"
                    var Expression=/http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                    var objExp=new RegExp(Expression);
                    if(objExp.test(str)==true){
                        return true;
                    }else{
                        return false;
                    }
                }
                $("#submit_url").bind("paste",function() {
                    setTimeout(function() {
                        var url = $("#submit_url").val();
                        if (checkeURL(url)) {
                            var data = {"url":url};
                            $scope.sb_loader_flag = true;
                            $http.post("/@title-get", data).then(function(res) {
                                if (res.data && res.data._STATE_ == "200") {
                                    if (res.data.DATA.title) {
                                        $scope.sb_loader_flag = false;
                                        $("#submit_name").val($.trim(res.data.DATA.title));
                                    }
                                }
                            });
                        }
                    },500);
                });
                $scope.add = function() {
                    var url = $(".sp_url").val();
                    var name = $(".sp_name").val();
                    if (url.length == 0 || name.length == 0) {
                        alert("提交不完整");
                    }
                    var id = getCookie("id");
                    var nick = getCookie("nick");

                    var data = {"url":url,"title":name,"id":id,"nick":nick};
                    $http.post("/@addWeb", data).then(function(res) {
                        if (res.data && res.data._STATE_ == "200") {
                            window.location.href = "/";
                        }
                    });
                }
    }])
    .controller('FeedBackController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.resultTip = "";
                $scope._resetForm = function() {
                    $(".fd_msg").val("");
                    $(".fd_email").val("");
                }
                $scope._validateEmail = function(str) {
                    var reg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                    if( reg.test(str) ){
                        return true;
                    }else{
                        return false;
                    }
                }
                $scope.add = function() {
                    var msg = $(".fd_msg").val();
                    var email = $(".fd_email").val();
                    $scope.resultTip = "";
                    if (msg.length == 0 || email.length == 0) {
                        alert("有些必填项需要填写");
                    }
                    //validate the email
                    if (!$scope._validateEmail(email)) {
                        alert("需要一个正确的邮箱地址");
                        return false;
                    }
                    $scope.resultTip = "发送中..";
                    var data = {"msg":msg,"email":email};
                    $http.post("/@feedback", data).then(function(res) {
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
    }])
    .controller('LoginController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                $scope.resultTip = "";
                $scope._redirect = function() {
                    window.location.href = "/";
                }
                $scope._validateEmail = function(str) {
                    var reg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                    if( reg.test(str) ){
                        return true;
                    }else{
                        return false;
                    }
                }
                $scope.login = function() {
                    var email = $("#lg_email").val();
                    var pwd = $("#lg_pwd").val();
                    if (email.length == 0 || pwd.length == 0) {
                        alert("提交不完整");
                    }
                    //validate the email
                    if (!$scope._validateEmail(email)) {
                        alert("需要一个正确的邮箱地址");
                        return false;
                    }
                    var data = {"email":email,"pwd":pwd};
                    $http.post("/@login", data).then(function(res) {
                        if (res.data && res.data._STATE_ == "200") {
                            $.cookie("__clh",JSON.stringify(res.data.DATA),{"path":"/","expires":730});
                            $scope._redirect();
                        } else if (res.data) {
                            alert(res.data.MSG);
                        }
                    });
                }
                $scope.register = function() {
                    var nickName = $("#rg_nickname").val();
                    var email = $("#rg_email").val();
                    var pwd = $("#rg_pwd").val();

                    if (nickName.length == 0 || email.length == 0 || pwd.length == 0) {
                        alert("提交不完整");
                    }
                    //validate the email
                    if (!$scope._validateEmail(email)) {
                        alert("需要一个正确的邮箱地址");
                        return false;
                    }
                    var data = {"email":email,"pwd":pwd,"nickname":nickName};
                    $http.post("/@register", data).then(function(res) {
                        console.log("print::" + JSON.stringify(res));
                        if (res.data && res.data._STATE_ == "200") {
                            $scope.resultTip = res.data.MSG;
                            $.cookie("__clh",JSON.stringify(res.data.DATA),{"path":"/","expires":730});
                            $scope._redirect();
                        }
                    });
                }
            }]);

