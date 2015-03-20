/**
 * HomeController
 *
 */
var ejs = require('ejs');
var AV = require('avoscloud-sdk').AV;
var Q = require('q');


var webUp = AV.Object.extend("WebUp");

var getClientCookie = function(req) {
    // 获得客户端的Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var obj = {};
    if (Cookies["__clh"]) {
        obj = JSON.parse(decodeURIComponent(Cookies["__clh"]));
    }
    return obj;
}

module.exports = {
    add: function (req, object, data) {
        var deferred = Q.defer();
        AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");
        var Table = AV.Object.extend(object);
        var table = new Table();
        table.save(data, {
            success: function(gameScore) {
                // Execute any logic that should take place after the object is saved.
                console.log('New object created with objectId: ' + gameScore.id);
                deferred.resolve(gameScore);
            },
            error: function(gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a AV.Error with an error code and description.
                console.log('Failed to create new object, with error code: ' + error.description);
                deferred.reject(error);
            }
        });
        return deferred.promise;
    },
    find: function (req, object, params) {
        var deferred = Q.defer();
        var GameScore = AV.Object.extend(object);
        var query = new AV.Query(GameScore);
        if (params && params.skip) {
            query.skip(params.skip);
        }
        var limit = 30;
        if (params && params.limit) {
            limit = params.limit;
        }
        query.limit(limit); // limit to at most 10 results
        query.descending("updatedAt");

        query.find({
            success: function(results) {
                // Do something with the returned AV.Object values
                var resArray = [];
                var ups = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var temp = {"url":object.get('url'),"title":object.get('title'),"nick":object.get('nick'),
                        "up":object.get('up'),"user":object.get('user'),"time":object.createdAt,"id":object.id};
                    ups.push(object.get('user'));
                    resArray.push(temp);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                deferred.reject(error);

            }
        });
        return deferred.promise;

    },
    findHome: function (req, object, params) {
        var deferred = Q.defer();
        var GameScore = AV.Object.extend(object);
        var query = new AV.Query(GameScore);
        if (params && params.skip) {
            query.skip(params.skip);
        }
        var limit = 30;
        if (params && params.limit) {
            limit = params.limit;
        }
        query.limit(limit); // limit to at most 10 results
        if (params && params.new) {
            console.log("print:new:");
            query.descending("createdAt");
        } else {
            query.descending("updatedAt");
        }

        //request cookie
        var cook = getClientCookie(req);
        var loginUser = cook['id'];

        query.find({
            success: function(results) {
                // Do something with the returned AV.Object values
                var obj = {};
                var resArray = [];
                var ups = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var temp = {"url":object.get('url'),"title":object.get('title'),"nick":object.get('nick'),
                        "up":object.get('up'),"user":object.get('user'),"time":object.createdAt,"id":object.id};
                    ups.push(object.id);
                    resArray.push(temp);
                }

                obj.listArray = resArray;
                var userQuery = new AV.Query(webUp);
                userQuery.containedIn("linkId",ups);
                userQuery.find({
                    success: function(upsItems) {
                        var upsArray = [];
                        for (var i = 0; i < upsItems.length; i++) {
                            var object = upsItems[i];
                            if (object.get("userId") == loginUser) {
                                upsArray.push(object.get("linkId"));
                            }
                        }
                        obj.ups = upsArray;
                        deferred.resolve(obj);
                    },
                    error: function(error) {
                        console.log("Error: user.find " + error.code + " " + error.message);
                        deferred.reject(error);
                    }
                });
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                deferred.reject(error);

            }
        });
        return deferred.promise;

    },
    first: function (req, object, key,value) {
        var deferred = Q.defer();
        AV.initialize("e4wnmd3z7unk5wxu3jm3579abpvopi9bb2e7fgsmqfl3zsqk", "4fktyp6v43v3n1vgke5771tovv62xuxsatnux7weq4b9kqwz");
        var GameScore = AV.Object.extend(object);
        var query = new AV.Query(GameScore);
        query.equalTo(key, value);
        query.first({
            success: function(results) {
                deferred.resolve(results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                deferred.reject(error);
            }
        });
        return deferred.promise;

    }
};

