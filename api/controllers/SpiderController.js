/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var avs = require('../services/AVService.js');
var FeedParser = require('feedparser')
    , request = require('request');



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
    rssParse : function(requ,resp) {
        var url = requ.param("src");
        console.log(url);
        var req = request(url)
            , feedparser = new FeedParser();
        var i = 0;
        var ok = 0;
        req.on('error', function (error) {
            // handle any request errors
        });
        req.on('response', function (res) {
            var stream = this;

            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            stream.pipe(feedparser);
        });


        feedparser.on('error', function(error) {
            // always handle errors
        });
        feedparser.on('readable', function() {
            // This is where the action is!
            var stream = this
                , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
                , item;
            while (item = stream.read()) {
                if (i < 20) {
                        console.log("print:ok:" + item.link);
                    avs.add(req,"WebSite",{"url":item.link,"title":item.title,"summary":item.summary,"read":0,"priority":0}).then(function(data) {
                        if (ok == 19) {
                            var result = {"_STATE_":"200","MSG":"OK"};
                            resp.json(result);
                        }
                        ok++;
                    },function(error) {
                        var result = {"_STATE_":"400","MSG":"ERROR"};
                        resp.json(result);
                        console.log("print::" + error);
                    });
                    i++;
                }
            }
        });
    }
};

