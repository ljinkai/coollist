/**
 * EmailController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var Q = require('q');
var nodemailer = require('nodemailer');


module.exports = {
    /**
     * 邮件发送功能
     * @param req
     * @param res
     * @returns {}
     */
    send: function (email) {
        var deferred = Q.defer();
        var transporter = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: 'andy@coollist.cn',
                pass: 'coollistQ1'
            }
        });
        var toEmail = email;
        var mailOptions = {
            from: '酷粒 <andy@coollist.cn>', // sender address
            to: toEmail, // list of receivers
            subject: '欢迎加入酷粒', // Subject line
            text: '', // plaintext body
            html: '<p>你好:</p><p>欢迎加入<a href="http://coollist.cn" target="_blank">酷粒</a>,您的账号已经创建成功。</p></p>' +
                '<p>登录邮箱：' + toEmail + '<br>登录地址:<a href="http://coollist.cn/login" target="_blank">http://coollist.cn/login</a></p>' +
                '<br><br><p>酷粒团队<br><a href="http://coollist.cn" target="_blank">coollist.cn</a></p>' // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                deferred.reject(error);
            }else{
                var obj = {"_STATE_":"200"};
                deferred.resolve(obj);
            }
        });
        return deferred.promise;
    }
};

