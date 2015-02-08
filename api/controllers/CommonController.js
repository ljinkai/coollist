/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var sc = require('node-schedule');
var avs = require('../services/AVService.js');



module.exports = {
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
    }
};

