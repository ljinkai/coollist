/**
 * ChromeController
 *
 */
var ejs = require('ejs');
var Q = require('q');
var AV = require('avoscloud-sdk').AV;

var url = require('url');
var crypto = require('crypto');
var request = require('request');
var cheerio = require("cheerio");
var avs = require('../services/AVService.js');
var log = sails.log;
var needle = require('needle');



module.exports = {
    parseSSQ : function(req,res) {
        var options = {
            headers: {
            }
        };
        var year = req.param("year");
        if (!year) {
            return false;
        }
        var url = "http://www.3dcp.cn/zs/gonggao.php?type=ssq&year=" + year;

        needle.get(url, options,function(error, result) {
            if (error) {
                log.error("parseSSQ:error");
            } else {
                var body = result.body;
                if (body) {
                    var $ = cheerio.load(body);
                    var title = "";
                    $("table[cellspacing=1]").each(function(i, e) {
                        var trs = $(e).find("tr");
                        trs.each(function(j,t) {
                            if (j > 1) {
                                var tds = $(t).find("td");
                                var array = [];
                                tds.each(function(k,d) {
                                    var txt = $(d).text();
                                    if (k == 3) {
                                        var ball = txt.split(" ");
                                        var reds = [];
                                        var blue = "";
                                        for (var i = 0; i < ball.length;i++) {
                                            if (i == 6) { //blue
                                                blue = ball[i].trim();
                                            } else {
                                                if (ball[i].trim().length > 0) {
                                                    reds.push(ball[i]);
                                                }
                                            }
                                        }
                                        array.push(reds.join(",").trim());
                                        array.push(blue.trim());
                                    } else {
                                        array.push(txt.trim());
                                    }
                                });
                                var insert = {
                                    "qi":array[0],
                                    "riqi":array[1],
                                    "jiangjin":array[2],
                                    "red":array[3],"blue":array[4],
                                    "1_zhu":array[5],
                                    "1_jin":array[6],
                                    "2_zhu":array[7],
                                    "2_jin":array[8],
                                    "3_zhu":array[9],
                                    "3_jin":array[10]};
                                log.info(JSON.stringify(insert));

                                avs.add(req,"SSQ",insert).then(function(data) {
                                        console.log(":ssq:add:ok:" + JSON.stringify(data));
                                    },function(error) {
                                        console.log("print:ssq:error");
                                    });
                            }
                        });
                    });
                    var result = {"_STATE_":"200","MSG":"成功","DATA":{"title":title}};
                    res.json(result);
                }

            }
        });
    },
    getSSQ : function(req,res) {
        var GameScore = AV.Object.extend("SSQ");
        var query = new AV.Query(GameScore);
        var year = req.param("year");

        query.limit(1000); // limit to at most 10 results
        query.greaterThanOrEqualTo("qi",year + "001");
        query.lessThanOrEqualTo("qi",year + "089");
        query.ascending("riqi");

        query.find({
            success: function(results) {
                // Do something with the returned AV.Object values
                var result = {"_STATE_":"200","MSG":"成功","DATA":results};
                res.json(result);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);

            }
        });

    },
    showSSQ: function(req,res) {
        res.render("ssq/ssq",{});
    }
};

