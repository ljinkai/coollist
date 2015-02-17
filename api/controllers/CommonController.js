/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var sc = require('node-schedule');
var sails = require('sails');
var log = sails.log;

var avs = require('../services/AVService.js');
var randtoken = require('rand-token');
AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");

module.exports = {
    addLink: function (req, res) {
        var GameScore = AV.Object.extend("WebSite");
        var gameScore = new GameScore();
        var url = req.param("url");
        var name = req.param("title");
        var user = req.param("id");
        var nick = req.param("nick");
        gameScore.set("url", url);
        gameScore.set("title", name);
        gameScore.set("user", user);
        gameScore.set("nick", nick);
        gameScore.set("read", 1);
        gameScore.set("up", 1);
        gameScore.set("priority", 0);
        var site = url.split("://");
        var siteEnd = site[1].split("/");
        var siteT = site[0] + "://" + siteEnd[0];
        gameScore.set("site", siteT);
        gameScore.save(null, {
            success: function(gameScore) {
                // Execute any logic that should take place after the object is saved.
                console.log('New object created with objectId: ' + gameScore.id);
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
    addFeedback : function(req,res) {
        var msg = req.param("msg");
        var email = req.param("email");
        console.log("print::" + email);
        avs.add(req,"FeedBack",{"msg":msg,"email":email}).then(function(data) {
            console.log("print::" + JSON.stringify(data));
                var result = {"_STATE_":"200","MSG":"感谢,我们会认真对待您的反馈"};
                res.json(result);
            },function(error) {
                console.log("print::" + error);
                var result = {"_STATE_":"400","MSG":"ERROR"};
                res.json(result);
            });
    },
    login : function(req,res) {
        var email = req.param("email");
        var pwd = req.param("pwd");

        var RgUser = AV.Object.extend("RegisterUser");
        var query = new AV.Query(RgUser);
        query.equalTo("email", email);
        query.equalTo("password", pwd);
        query.first({
            success: function(results) {
                if (results) {
                    var token = results.get("sessionToken");
                    var nickName = results.get("nickName");
                    var userId = results.get("objectId");
                    var result = {"_STATE_":"200","MSG":"成功登陆","DATA":{"nick":nickName,"email":email,"token":token,"id":userId}};
                    res.json(result);
                } else {
                    var result = {"_STATE_":"400","MSG":"用户名或密码错误！"};
                    res.json(result);
                }
            },
            error: function(error) {
                var result = {"_STATE_":"400","MSG":"用户名或密码错误！"};
                res.json(result);
            }
        });
    },
    register : function(req,res) {
        var nickName = req.param("nickname");
        var email = req.param("email");
        var pwd = req.param("pwd");
        var token = randtoken.generate(32);
        avs.add(req,"RegisterUser",{"nickName":nickName,"email":email,"password":pwd,"sessionToken":token}).then(function(data) {
            var userId = data.id;
            var result = {"_STATE_":"200","MSG":"注册成功","DATA":{"nick":nickName,"email":email,"token":token,"id":userId}};
            res.json(result);
        },function(error) {
            var result = {"_STATE_":"400","MSG":"ERROR"};
            res.json(result);
        });
    }
};

