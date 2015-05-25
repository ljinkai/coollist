/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var sc = require('node-schedule');
var sails = require('sails');
var log = sails.log;
var http = require('http');
var request = require('request');
var cheerio = require("cheerio");




var avs = require('../services/AVService.js');
AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");
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

module.exports = {
    item: function (req, res) {
        res.locals.layout = "itemLayout";
        ejs.filters.timeago = function(time) {
            return timeAgo(time,true);
        };
        var id = req.param("id");
        avs.first(req,"WebSite","objectId",id).then(function(object) {
            var temp = {"url":object.get('url'),"title":object.get('title'),"nick":object.get('nick'),
                "up":object.get('up'),"user":object.get('user'),"time":object.createdAt,"id":object.id};
            res.view("item",{"result":temp});
        },function(error) {
            res.notFound();
        });
    },
    addComment : function(req,res) {
        var comment = AV.Object.extend("Comment");
        var gameScore = new comment();
        var con = req.param("content");
        var id = req.param("userId");
        var itemId = req.param("itemId");
        var nick = req.param("nick");
        gameScore.set("content", con);
        gameScore.set("userId", id);
        gameScore.set("nick", nick);
        gameScore.set("itemId", itemId);
        gameScore.save(null, {
            success: function(gameScore) {
                // Execute any logic that should take place after the object is saved.
                var result = {"_STATE_":"200","MSG":"添加成功"};
                res.json(result);
            },
            error: function(gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a AV.Error with an error code and description.
                console.log('Failed to create new object, with error code: ' + error.description);
                var result = {"_STATE_":"400","MSG":"ERROR"};
                res.json(result);
            }
        });
    },
    getComments : function(req,res) {
        var comment = AV.Object.extend("Comment");
        var itemId = req.param("itemId");
        var query = new AV.Query(comment);

        query.descending("updatedAt");
        query.equalTo("itemId", itemId);
        query.find({
            success: function(results) {
                // Do something with the returned AV.Object values
                var resArray = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var temp = {"content":object.get('content'),"nick":object.get('nick'),
                        "user":object.get('userId'),"time":object.createdAt,"id":object.id};
                    resArray.push(temp);
                }
                var result = {"_STATE_":"200","MSG":"添加成功","DATA":resArray};
                res.json(result);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                var result = {"_STATE_":"400","MSG":"ERROR"};
                res.json(result);
            }
        });

    }
};

