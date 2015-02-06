/**
 * HomeController
 *
 */
var spiderCtr = require('../controllers/SpiderController.js');

//引进 node-schedule
var schedule = require('node-schedule');
//初始化并设置定时任务的时间
var rule = new schedule.RecurrenceRule();
rule.hour = 2;
//处理要做的事情
var j = schedule.scheduleJob(rule, function(){
    spiderCtr.excuteRssInsert();
});

