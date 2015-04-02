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

module.exports = {
    excuteRssInsert : function(rssArray,num) {
        async.each(rssArray, function(url, callback) {
            // Perform operation on file here.
            setTimeout(function(){
                sds.rssParse(url, num).then(function(result) {
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

