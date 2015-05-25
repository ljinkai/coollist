/**
 * ChromeController
 *
 */
var ejs = require('ejs');
var Q = require('q');
var url = require('url');
var crypto = require('crypto');
var request = require('request');
var cheerio = require("cheerio");
var avs = require('../services/AVService.js');
var weixin = require('../services/WeiXinService.js');
var log = sails.log;
var needle = require('needle');



module.exports = {
    sendNotification : function(req,res) {
        var subId = req.param("subId");

        var options = {
            headers: {
                'Authorization': 'key=AIzaSyAYEz9hsORDlEAiOPJZoLbA_YWLYsVxr6g',
                'Content-Type': 'application/json'
            }
        };

        var url = "https://android.googleapis.com/gcm/send";
        var array = [];
        array.push(subId);

        var param = {
            "registration_ids":array
        };
        console.log("print::" + JSON.stringify(param));

        needle.post(url, param, options,function(error, result) {
            console.log(error + "print::" + result);
            if (error) {
            } else {
                var status = result.statusCode;
                if (status == 200) {
                    var body = result.body;
                    console.log("print:body:" + body);

                    var result = {"_STATE_":"200","MSG":"OK"};
                    res.json(result);
                }
            }
        });

//        var message = new gcm.Message({
//            collapseKey: 'demo',
//            delayWhileIdle: true,
//            timeToLive: 3,
//            data: {
//            }
//        });
//
//        // Set up the sender with you API key
//        var sender = new gcm.Sender('AIzaSyAYEz9hsORDlEAiOPJZoLbA_YWLYsVxr6g');
//
//        // Add the registration IDs of the devices you want to send to
//        var registrationIds = [];
//        registrationIds.push(subId);
//
//        // Send the message
//        // ... trying only once
//        sender.sendNoRetry(message, registrationIds, function(err, result) {
//            if(err) console.error(err);
//            else    console.log(result);
//        });
        var result = {"_STATE_":"200","MSG":"OK"};
        res.json(result);

    }
};

