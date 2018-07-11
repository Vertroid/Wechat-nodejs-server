'use strict';
const crypto = require('crypto');
const fs = require('fs');
const httpUtil = require("../../../utils/http-util");
const util = require("util");
const accessTokenJson = require("../../../config/access-token.json");

var WeChat = function(config){
    this.config = config;
    this.token = config.token;
    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.apiDomain = config.apiDomain;
    this.apiUrl = config.apiUrl;
};

WeChat.prototype.auth = function(req, res){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    var array = [this.config.token, timestamp, nonce];
    array.sort();

    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1');
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex');

    if(resultCode === signature){
        res.send(echostr);
    }else{
        res.send("mismatch");
    }
};

WeChat.prototype.getAccessToken = function(){
    var that = this;
    return new Promise(function(resolve, reject){
        var currentTime = new Date().getTime();
        var url = util.format(that.apiUrl.accessTokenApi, that.apiDomain, that.appId, that.appSecret);
        if(accessTokenJson.accessToken === "" || accessTokenJson.expire < currentTime){
            httpUtil.requestGet(url).then(function(data){
                var result = JSON.parse(data);
                if(result["errcode"] !== undefined || result["errcode"] === 0){
                    accessTokenJson.accessToken = result["access_token"];
                    accessTokenJson.expire = new Date().getTime() + (parseInt(result["expires_in"]) - 200) * 1000;
                    fs.write('/access-token.json', JSON.stringify(accessTokenJson));
                    resolve(accessTokenJson.accessToken);
                }else{
                    resolve(result);
                }
            });
        }else{
            resolve(accessTokenJson.accessToken);
        }
    });
};

WeChat.prototype.responseMessage = function(){

};

module.exports = WeChat;