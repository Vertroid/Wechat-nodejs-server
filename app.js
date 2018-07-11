'use strict';
const express = require('express');
const config = require('./config/config.json');
const WeChat = require('./apps/passport/services/wechat');

var app = express();
var wechatApp = new WeChat(config);

app.get('/', function(req, res){
    wechatApp.auth(req, res);
});

app.get('/getAccessToken', function(req, res){
    wechatApp.getAccessToken().then(function(data){
        res.send(data);
    })
});

app.listen(3000);