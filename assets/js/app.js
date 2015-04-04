/**
 * the public file to define banner、filter、service..
 */
angular.module("app",[])
    .controller('HomeController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                function getCookie(key) {
                    var appStr = $.cookie("__clh");
                    if (appStr) {
                        appStr = JSON.parse(appStr);
                        return appStr[key];
                    }
                }
                $scope.duang = function(event,linkId) {
                    var userId = getCookie("id");
                    if (userId && (userId.length > 0)) {
                        var data = {"linkId":linkId,"userId":userId};
                        $http.post("/@duang", data).then(function(res) {
                            if (res.data && res.data._STATE_ == "200") {
                                $("#" + linkId + "_up").removeClass("ls_up_img");
                                var count = parseInt($("#" + linkId + "_up_count").text()) + 1;
                                $("#" + linkId + "_up_count").text(count)
                            }
                        });
                    } else {
                        window.location.href = "/login";
                    }
                }
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
                    var loc = window.location.href;
                    if (loc.indexOf("/new") > 0) {
                        $scope.nav_item = "new";
                    } else if (loc.indexOf("/submit") > 0) {
                        $scope.nav_item = "submit";
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
                        if (res.data && res.data._STATE_ == "200") {
                            $scope.resultTip = res.data.MSG;
                            $.cookie("__clh",JSON.stringify(res.data.DATA),{"path":"/","expires":730});
                            $scope._redirect();
                        } else if (res.data){
                            alert(res.data.MSG);
                        }
                    });
                }
                // keypress
                $scope.doLoginKeyPress = function(event) {
                    if (event.keyCode == 13) {
                        $scope.login(event);
                    }
                };
                $scope.doSignKeyPress = function(event) {
                    if (event.keyCode == 13) {
                        $scope.register(event);
                    }
                };
    }])
    .controller('CommentController',
        ['$rootScope', '$scope','$http',
            function($rootScope, $scope,$http) {
                function getCookie(key) {
                    var appStr = $.cookie("__clh");
                    if (appStr) {
                        appStr = JSON.parse(appStr);
                        return appStr[key];
                    }
                }
                $scope.add = function(event) {
                    var userId = getCookie("id");
                    if (userId && (userId.length > 0)) {
                        var con = $("#content").val();
                        if (con.length == 0) {
                            alert("填写点评论吧");
                        }
                        var itemId = $scope.id;
                        var nick = getCookie("nick");
                        var data = {"content":con,"userId":userId,"itemId":itemId,"nick":nick};
                        $http.post("/@comment", data).then(function(res) {
                            if (res.data && res.data._STATE_ == "200") {
                                $scope.getComments();
                            }
                        });
                    } else {
                        window.location.href = "/login";
                    }
                }
                $scope.getComments = function(event) {
                        $scope.id = $(".item_title").data("id");
                        var data = {"itemId":$scope.id};
                        $http.post("/@getComments", data).then(function(res) {
                            if (res.data && res.data._STATE_ == "200") {
                                $scope.comments = res.data.DATA;
                            }
                        });
                }
                $scope.getComments();
            }])
    .filter("timeAgo",function() {
        function formatDate(now) {
            now = new Date(now);
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            month = month < 10 ? "0" + month : month;
            var date=now.getDate();
            date = date < 10 ? "0" + date : date;
            var hour=now.getHours();
            hour = hour < 10 ? "0" + hour : hour;
            var minute=now.getMinutes();
            minute = minute < 10 ? "0" + minute : minute;
            var second=now.getSeconds();
            second = second < 10 ? "0" + second : second;
            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
        } ;
        function doDateDiff  (interval, date1, date2, dec) {
            var objInterval = {
                'D' : 1000 * 60 * 60 * 24,
                'H' : 1000 * 60 * 60,
                'M' : 1000 * 60,
                'S' : 1000,
                'T' : 1
            };
            interval = interval.toUpperCase();
            var dt1 = new Date(Date.parse(date1.replace(/-/g, '/')));
            var dt2 = new Date(Date.parse(date2.replace(/-/g, '/')));
            try {
                if (dec) {
                    dec = parseInt(dec);
                    return Math.round((dt2.getTime() - dt1.getTime())
                        / eval('objInterval.' + interval) * (dec * 10))
                        / (dec * 10);
                } else {
                    return Math.round((dt2.getTime() - dt1.getTime())
                        / eval('objInterval.' + interval));
                }
            } catch (e) {
                return e.message;
            }
        }
        function timeAgo(timeStr,timeFlag) {
            if (!timeStr) {
                return "";
            }
            if(timeFlag) { //传入的日期是否为timeStamp
                timeStr = formatDate(timeStr);
            }
            var today = new Date();
            var weekday=new Array(7);
            weekday[0]="星期日";
            weekday[1]="星期一";
            weekday[2]="星期二";
            weekday[3]="星期三";
            weekday[4]="星期四";
            weekday[5]="星期五";
            weekday[6]="星期六";

            var y=today.getFullYear();
            var month=today.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var td=today.getDate();
            if (td < 10) {
                td = "0" + td;
            }

            var str = timeStr;
            str = str.substring(0,16);
            var strYMT = str.substring(0,10);

            var ymt = y + "-" + month + "-" + td;//today
            if (ymt == strYMT) {
                str = str.substring(11,16);
            } else {
                var diff = doDateDiff("D",strYMT,ymt);
                if (diff == 1) {
                    str = "昨天";
                } else if (diff < 4) {
                    str = weekday[new Date(strYMT).getDay()];
                } else {
                    if (str.substring(0,4) == y) {//当前年
                        str = str.substring(5,10);
                    } else {
                        str = str.substring(2,10);
                    }
                }
            }
            return str;
        }
        return function(str) {
            return timeAgo(str,true);
        }

    });

