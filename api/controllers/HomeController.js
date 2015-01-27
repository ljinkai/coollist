/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var avs = require('../services/AVService.js');

module.exports = {
    home: function (req, res) {
        avs.find(req,"WebSite").then(function(resArray) {
            res.view("homepage",{"results":resArray});
        },function(error) {
            res.notFound();
        });
    }
};

