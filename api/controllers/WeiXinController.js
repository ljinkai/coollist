/**
 * WeiXinController
 *
 */
var ejs = require('ejs');
var url = require('url');
var crypto = require('crypto');
var avs = require('../services/AVService.js');
var weixin = require('../services/WeiXinService.js');

var TOKEN = "coollist1984";
weixin.token = 'coollist1984';


var getRecommend = function() {
    var deferred = Q.defer();
    avs.findHome(null,"WebSite",{"limit":10}).then(function(result) {
        var resArray = result.listArray;
        var str = "";
        for (var i = 0 ; i < resArray.length; i++) {
            var item = resArray[i];
            str += item.title;
            str += "\n";
        }
        deferred.resolve(str);
    },function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
}


// 监听文本消息
weixin.textMsg(function(msg) {
    var resMsg = {};

    switch (msg.content) {
        case "1" :
            // 返回文本消息
            getRecommend().then(function(data) {
                resMsg = {
                    fromUserName : msg.toUserName,
                    toUserName : msg.fromUserName,
                    msgType : "text",
                    content : data,
                    funcFlag : 0
                };
            });
            break;

        case "音乐" :
            // 返回音乐消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "music",
                title : "音乐标题",
                description : "音乐描述",
                musicUrl : "音乐url",
                HQMusicUrl : "高质量音乐url",
                funcFlag : 0
            };
            break;

        case "图文" :

            var articles = [];
            articles[0] = {
                title : "PHP依赖管理工具Composer入门",
                description : "PHP依赖管理工具Composer入门",
                picUrl : "http://weizhifeng.net/images/tech/composer.png",
                url : "http://weizhifeng.net/manage-php-dependency-with-composer.html"
            };

            articles[1] = {
                title : "八月西湖",
                description : "八月西湖",
                picUrl : "http://weizhifeng.net/images/poem/bayuexihu.jpg",
                url : "http://weizhifeng.net/bayuexihu.html"
            };

            articles[2] = {
                title : "「翻译」Redis协议",
                description : "「翻译」Redis协议",
                picUrl : "http://weizhifeng.net/images/tech/redis.png",
                url : "http://weizhifeng.net/redis-protocol.html"
            };

            // 返回图文消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "news",
                articles : articles,
                funcFlag : 0
            }
            break;

        default:
            // 返回文本消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "text",
                content : "感谢您的关注，酷粒是一个专注酷链接分享的站点。\n 回复【1】可查看今天推荐",
                funcFlag : 0
            };
            break;
    }

    weixin.sendMsg(resMsg);
});

// 监听图片消息
weixin.imageMsg(function(msg) {
    console.log("imageMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
weixin.locationMsg(function(msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
weixin.urlMsg(function(msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
weixin.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(JSON.stringify(msg));
});

// Start

module.exports = {
    signature : function(req,res) {
        // 签名成功
        if (weixin.checkSignature(req)) {
            res.send(200, req.query.echostr);
        } else {
            res.send(200, 'fail');
        }
    },
    receive: function(req,res) {
            // loop
            weixin.loop(req, res);
    }
};

