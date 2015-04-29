/**
 * HomeController
 *
 */
var spiderCtr = require('../controllers/SpiderController.js');

//引进 node-schedule
var schedule = require('node-schedule');

var rssArray = [
    "http://www.guokr.com/rss/",
    "http://cnbeta.feedsportal.com/c/34306/f/624776/index.rss",
    "http://www.pingwest.com/feed/",
    "http://feeds.mashable.com/Mashable/SocialMedia?format=xml",
    "http://techcrunch.cn/feed/"
];
var rssArrayNoon = [
    "http://tech2ipo.feedsportal.com/c/34822/f/641707/index.rss",
    "http://www.kuailiyu.com/feed/",
    "http://www.huxiu.com/rss/0.xml",
    "http://www.leikeji.com/rss",
    "http://cn.technode.com/feed/"
];
var rssArrayAfter = [
    "http://www.36kr.com/feed/",
    "http://www.ifanr.com/feed",
    "http://feed.yeeyan.org/select",
    "http://feeds.feedburner.com/ftchina"
];
//--first
//初始化并设置定时任务的时间
var rule = new schedule.RecurrenceRule();
rule.hour = 2;
rule.minute = 0;
//处理要做的事情
var j = schedule.scheduleJob(rule, function(){
    spiderCtr.excuteRssInsert(rssArray,10);
});
//--second
var ruleNoon = new schedule.RecurrenceRule();
ruleNoon.hour = 11;
ruleNoon.minute = 0;
//处理要做的事情
var noon = schedule.scheduleJob(ruleNoon, function(){
    spiderCtr.excuteRssInsert(rssArrayNoon,6);
});
//--third
var ruleAfter = new schedule.RecurrenceRule();
ruleAfter.hour = 14;
ruleAfter.minute = 0;
//处理要做的事情
var after = schedule.scheduleJob(ruleAfter, function(){
    spiderCtr.excuteRssInsert(rssArrayAfter,5);
});

