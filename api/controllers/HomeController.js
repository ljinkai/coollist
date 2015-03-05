/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var avs = require('../services/AVService.js');
var limit = 30;
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


var webSite = AV.Object.extend("WebSite");

module.exports = {
    home: function (req, res) {
        ejs.filters.timeago = function(time) {
            return timeAgo(time,true);
        };

        avs.findHome(req,"WebSite").then(function(result) {
            var resArray = result.listArray;
            var ups = result.ups;
            res.view("homepage",{"results":resArray,"ups":ups,"next":{"skip":30}});
        },function(error) {
            res.notFound();
        });
    },
    next: function (req, res) {
        var params = {"skip":req.param("skip")};
        ejs.filters.timeago = function(time) {
            return timeAgo(time,true);
        };
        avs.findHome(req,"WebSite",params).then(function(result) {
            var skip = parseInt(req.param("skip")) + limit;
            var resArray = result.listArray;
            var ups = result.ups;
            res.view("homepage",{"results":resArray,"ups":ups,"next":{"skip":skip}});
        },function(error) {
            res.notFound();
        });
    },
    duang: function (req, res) {
        var userId = req.param("userId");
        var linkId = req.param("linkId");

        avs.add(req,"WebUp",{"linkId":linkId,"userId":userId}).then(function(data) {
            var result = {"_STATE_":"200","MSG":"OK"};
            var query = new AV.Query(webSite);
            query.get(linkId, {
                success: function(gameScore) {
                    // The object was retrieved successfully.
                    gameScore.increment("up");
                    gameScore.save();
                    res.json(result);
                },
                error: function(object, error) {
                    var result = {"_STATE_":"400","MSG":"ERROR"};
                    res.json(result);
                }
            });
        },function(error) {
            console.log("print::" + error);
            var result = {"_STATE_":"400","MSG":"ERROR"};
            res.json(result);
        });
    },
    about: function (req, res) {
        res.view("about");
    },
    feedback: function (req, res) {
        res.view("feedback");
    },
    login: function (req, res) {
        res.view("login");
    }
};

