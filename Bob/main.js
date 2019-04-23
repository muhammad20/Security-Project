//var hhtp = require('http');
var bigInt = require('big-integer');
var globals = require('./../globals');
var elgamal = require('./../elgamal-ds');
const http = require('http');
const NodeRSA = require('node-rsa');
const fileHandler = require('./../file_handler');

const getAliceCertificate = function(callback) {

    var certRequest = http.request('http://localhost:9000/?id='+globals.aliceId, function(res) {
        var buffer = '';
        var stringDecoder = new stringDecoder('utf-8');

        res.on('data', function(data) {
            buffer += stringDecoder.write(data);
        });

        res.on('end', function () {
            buffer += stringDecoder.end();
            callback(buffer);
        });
    });

    certRequest.end();
}

//verify Alice's certificate with the authority's public key
const verifyEncrypedCertificate = function(encryptedCertificate, callback) {
    var k2 = new NodeRSA(globals.authorityPublicKey, 'pkcs8-public');
    const recData = k2.decryptPublic(certificate, 'utf-8');
    return recData.includes('CERTIFICATE');
}

const verifyAliceSignature = function(certificate) {
    verifyEncrypedCertificate()
}

const readAlicesMessage = function() {
    fileHandler.read(__dirname + "../", "msg","txt", function(err, msg) {
        if(!err && msg) {
            fileHandler.read(__dirname + "/keys", "private", "key", function(err, key) {
                var bob_private_key = new NodeRSA(key);
                var decryptedMessage = bob_private_key.decrypt(msg);
                callback(decryptedMessage);
            });
        }
    });
}

const receiveMsg = function() {
    var msg = readAlicesMessage();
    var aliceCert;
    getAliceCertificate(function(cert) {
        aliceCert = cert;
    });
    
}


// a test case used @ elgamal-ds
var msg = "hamada";
var y = bigInt("4a36568d7e49913d58d9b8b4b7e16f47c800cacbb67de8292299be4160f92ebe608f5a6ccfbd04fcf28ed8aed54fa275389ff612af8f50437b634e9d9b3664a5d91982965e57eb18df921c0f287aa92e499a9ed3633cbb8107db0d434f0d3d98edb1bcfb4040e2c52f74993356d2ec5e234e820abcf764b7b5de0f2986645a04", 16);
var s1 = bigInt("9756266fccb7ad13b0df048440ae7810632f4ff740a31abab634ff7986afbfcabb59a521fc121a68d919987340e0ebec6ed25b3ad564266dbb05c33fbc189108abe294168793db8e1a3ad6eb0b652f120c1122c9e01977258e978c23f36e81df0981db0c3062436dfef89367f9d7d5116c0e161f465f12fd6c9f4cd777820935",16);
var s2 = bigInt("7dfb3b9c998c417a7362983b00d44d7a752d975c0f00f2cd075f0349e7beedca65ed84e1cebbd76f2a8a436f86432b5e8468c32aa42353c3bffdfe5f65f7ede40e9bfc622f13e9cf828fbbc63f0703160c050e14093c734d874eb3451bf607940ef3aca37809fffaa6024be95f6430edfa7e57ea5f117bf7296fff22f73c8cf5",16);
elgamal.verify(msg, globals.a, globals.q, y, s1, s2);