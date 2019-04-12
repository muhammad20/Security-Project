// HTTP module to send reuest to the authority server
const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;
// Global variables
const globals = require('./../globals');

// Send a get request to the certificate authority with query string parameter with pop's id 
var getBobsCertificate = function (callback) {

    // Options to be passed to the request module
    const requestOptions = {
        
        'port': 9000,
        'method': 'GET',

        'path': '?id=' + globals.bobId
    };
    console.log("ok");
    var xx = http.request("http://localhost:9000/?id="+globals.bobId, function (res) {
        callback(res);
    });
    xx.end();
};

var x = function (res) {
    var buffer = '';
    var stringDecoder = new StringDecoder('utf-8');
 
    res.on('data',function(data){
         buffer += stringDecoder.write(data);
        
     });
    res.on('end',function(){
        buffer += stringDecoder.end();
        console.log(buffer);
    });
}
getBobsCertificate(x);