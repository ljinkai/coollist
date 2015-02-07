/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var avs = require('../services/AVService.js');
var limit = 30;
module.exports = {
    home: function (req, res) {
        avs.find(req,"WebSite").then(function(resArray) {
            res.view("homepage",{"results":resArray,"next":{"skip":30}});
        },function(error) {
            res.notFound();
        });
    },
    next: function (req, res) {
        var params = {"skip":req.param("skip")};
        avs.find(req,"WebSite",params).then(function(resArray) {
            var skip = parseInt(req.param("skip")) + limit;
            res.view("homepage",{"results":resArray,"next":{"skip":skip}});
        },function(error) {
            res.notFound();
        });
    }
};

