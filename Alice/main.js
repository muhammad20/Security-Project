// HTTP module to send reuest to the authority server
const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;
// Global variables
const globals = require('./../globals');
const NodeRSA = require('node-rsa');
const fileHandler = require('./../file_handler');

// Send a get request to the certificate authority with query string parameter with pop's id 
const getBobsCertificate = function (callback) {

    // Options to be passed to the request module
    const requestOptions = {

        'port': 9000,
        'method': 'GET',

        'path': '?id=' + globals.bobId
    };

    var certRequest = http.request("http://localhost:9000/?id=" + globals.bobId, function (res) {
        var buffer = '';
        var stringDecoder = new StringDecoder('utf-8');

        res.on('data', function (data) {
            buffer += stringDecoder.write(data);

        });
        res.on('end', function () {
            buffer += stringDecoder.end();
            callback(buffer);
        });
    });
    certRequest.end();
};



// Verify the certificate by decrypting it with the authority public key 
const verifyCertificate = function (certificate, callback) {
   
 
    var k2 = new NodeRSA(globals.authorityPublicKey,'pkcs8-public');
  
    const recData = k2.decryptPublic(certificate,'utf8');
 
    


}


const sendBob = function () {
    // Get bob's certificate
    getBobsCertificate( function(certificate){
        // Verify bob's certificate
        
        verifyCertificate(certificate,function(){

        } );
    });
    

    // Extract bob's public key

    // Sign the message with El-Gammal

    // Encrypt the message using RSA and bob's public key



};

sendBob();