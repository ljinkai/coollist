/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var sc = require('node-schedule');
var avs = require('../services/AVService.js');
var sds = require('../services/SpiderService.js');
var FeedParser = require('feedparser')
    , request = require('request');
var async = require('async');

var rssArray = [
    "http://cnbeta.feedsportal.com/c/34306/f/624776/index.rss",
    "http://www.pingwest.com/feed/",
    "http://techcrunch.cn/feed/"
];


module.exports = {
    connectLean: function (req, res) {
        AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");
        var GameScore = AV.Object.extend("WebSite");
        var gameScore = new GameScore();
        var url = req.param("url");
        var name = req.param("title");
        gameScore.set("url", url);
        gameScore.set("title", name);
        gameScore.save(null, {
            success: function(gameScore) {
                // Execute any logic that should take place after the object is saved.
                console.log('New object created with objectId: ' + gameScore.id);
                var result = {"_STATE_":"200","MSG":"OK"};
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
    excuteRssInsert : function() {
        async.each(rssArray, function(url, callback) {
            // Perform operation on file here.
            setTimeout(function(){
                sds.rssParse(url, 10).then(function(result) {
                    callback();
                },function(error) {
                    console.log('excuteRssInsert: ' + error);
                });
            }, 3000);
        }, function(err){
            // if any of the file processing produced an error, err would equal that error
            if( err ) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('A file failed to process');
            } else {
                console.log('All files have been processed successfully');
            }
        });
    },
    rssParse : function(requ,resp) {
        var url = requ.param("src");
        sds.rssParse(url, 10).then(function(result) {
            resp.json(result);
        },function(error) {
            resp.json(error);
        });
    }
};

