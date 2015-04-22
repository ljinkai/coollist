/**
 * WeiXinController
 *
 */
var ejs = require('ejs');
var url = require('url');
var crypto = require('crypto');

var TOKEN = "coollist1984";
module.exports = {
    signature : function(req,res) {
        var reqObj = url.parse(req.url,true);
        var params = reqObj['query'];
        var signature = params['signature'];
        var timestamp = params['timestamp'];
        var nonce = params['nonce'];
        var echostr = params['echostr'];
        var tmpArr = [TOKEN,timestamp,nonce];
        tmpArr.sort();
        var tmpStr = tmpArr.join('');
        var shasum = crypto.createHash('sha1');
        shasum.update(tmpStr);
        var shaResult = shasum.digest('hex');
        if (shaResult == signature) {
            console.log("print::" + echostr);

            res.send(echostr);
        } else {
            console.log("print:: not weixinServer!");
            res.send("not weixin server");
        }
    }
};

