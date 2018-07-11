const https = require('https');

var HttpUtil = function(){};

HttpUtil.prototype.requestGet = function(url){
    return new Promise(function(resolve, reject){
        https.get(url, function(res){
            var buffer = [];
            var result = "";
            res.on('data', function(data){
                buffer.push(data);
            });
            res.on('end', function(){
                result = Buffer.concat(buffer).toString('utf8');
                buffer = [];
                resolve(result);
            });
        }).on('error', function(error){
            reject(error);
        })
    })
};

module.exports = new HttpUtil();
