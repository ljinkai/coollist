/**
 * HomeController
 *
 */
var AV = require('avoscloud-sdk').AV;
var sc = require('node-schedule');
var Q = require('q');
var avs = require('../services/AVService.js');
var FeedParser = require('feedparser')
    , request = require('request');

module.exports = {
    /**
     * 根据url读取rss内容，并存储到云服务
     * @param url
     * @returns promise
     */
    rssParse : function(url, number) {
        var deferred = Q.defer();
        var req = request(url);
        var feedParser = new FeedParser();
        var limitNum = 10;
        if (number) {
            limitNum = number;
        }
        var i = 0;
        var ok = 0;
        req.on('error', function (error) {
            // handle any request errors
        });
        req.on('response', function (res) {
            var stream = this;
            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
            stream.pipe(feedParser);
        });

        feedParser.on('error', function(error) {
            // always handle errors
        });
        feedParser.on('readable', function() {
            // This is where the action is!
            var stream = this
                , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
                , item;
            var webLink = meta.link;
            while (item = stream.read()) {
                if (i < limitNum) {
//                    console.log("print:ok:" + JSON.stringify(item));
                    avs.add(req,"WebSite",{"url":item.link,"title":item.title,
                        "summary":item.summary,"read":1,"up":1,"priority":0,
                        "site":webLink,"user":"cl_andy","nick":"Andy"}).then(function(data) {
                        if (ok == (limitNum - 1)) {
                            var result = {"_STATE_":"200","MSG":"OK"};
                            deferred.resolve(result);
                        }
                        ok++;
                    },function(error) {
                        console.log("print::" + error);
                        var result = {"_STATE_":"400","MSG":"ERROR"};
                        deferred.reject(result);
                    });
                    i++;
                }
            }
        });
        return deferred.promise;

    }
};

