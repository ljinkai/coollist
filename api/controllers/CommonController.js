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
var emailServ = require('../services/EmailService.js');
var randtoken = require('rand-token');
AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");
var ids = [];
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
    parseHtmlTitle : function(req,res) {
        var url = req.param("url");

        function download(url, callback) {
            request(url, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    callback(html);
                }
            });
        }
        download(url, function(data) {
            if (data) {
                var $ = cheerio.load(data);
                var title = "";
                $("title").each(function(i, e) {
                    title = $(e).text();
                });
                var result = {"_STATE_":"200","MSG":"成功","DATA":{"title":title}};
                res.json(result);
            }
        });
    },
    addFeedback : function(req,res) {
        var msg = req.param("msg");
        var email = req.param("email");
        avs.add(req,"FeedBack",{"msg":msg,"email":email}).then(function(data) {
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
                    var userId = results.id;
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

        var RgUser = AV.Object.extend("RegisterUser");
        var query = new AV.Query(RgUser);
        query.equalTo("email", email);
        query.first({
            success: function(results) {
                if (results) {
                    var result = {"_STATE_":"400","MSG":"此邮箱已经存在!"};
                    res.json(result);
                } else {
                    avs.add(req,"RegisterUser",{"nickName":nickName,"email":email,"password":pwd,"sessionToken":token}).then(function(data) {
                        emailServ.send(email).then(function(eData) {
                            var userId = data.id;
                            var result = {"_STATE_":"200","MSG":"注册成功","DATA":{"nick":nickName,"email":email,"token":token,"id":userId}};
                            res.json(result);
                        },function(error) {
                            console.log("send email error");
                            var result = {"_STATE_":"400","MSG":"ERROR"};
                            res.json(result);
                        });
                    },function(error) {
                        var result = {"_STATE_":"400","MSG":"ERROR"};
                        res.json(result);
                    });
                }
            },
            error: function(error) {
                console.log("print::3333");

                var result = {"_STATE_":"400","MSG":"注册出现问题！"};
                res.json(result);
            }
        });
    },
    emailSend : function(email) {
        emailServ.send(email).then(function(data) {
            console.log("ok send email");
        },function(error) {
            console.log("send email error");
        });
    },
    addComment : function(req,res) {
        var comment = AV.Object.extend("Comment");
        var gameScore = new comment();
        var con = req.param("content");
        var id = req.param("userId");
        gameScore.set("content", con);
        gameScore.set("addUser", id);
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
    testSocket: function(req, res) {
//        var friendId = req.param('friendId');
//        sails.sockets.emit(friendId, 'privateMessage', {from: req.session.userId, msg: 'Hi!'});
//        res.json({
//            message: 'Message sent!'
//        });

        var nameSent = req.param('name');
        if (nameSent && req.isSocket){
            setTimeout(function() {
                console.log("print:settime:");
                var toId = ids[1];
                var fromId = ids[0];
                sails.sockets.emit(toId, 'user', {from: fromId, msg: 'Hi!'});
//                sails.sockets.blast("user", { msg: 'Hi there!' });
            },4000);
            res.json({
                message: "return " + nameSent
            });

        } else if (req.isSocket){
            var socketId = sails.sockets.id(req.socket);
            console.log(socketId);
            ids.push(socketId);
        } else {
            res.render("socket");
        }

    }
};

