//var hhtp = require('http');
var bigInt = require('big-integer');
var globals = require('./../globals');
var elgamal = require('./../elgamal-ds');
const http = require('http');
const NodeRSA = require('node-rsa');
var bigInt = require('big-integer');
const fileHandler = require('./../file_handler');
const StringDecoder = require('string_decoder').StringDecoder;
var KeyEncoder = require('key-encoder'),
keyEncoder = new KeyEncoder('secp256k1')


const getAliceCertificate = function (callback) {

    var certRequest = http.request('http://localhost:9000/?id=' + globals.aliceId, function (res) {
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
}

/**
 * @param {encryptedCertificate} the encrypted certificate received from the authority
 * 
 * Loads the public key of the authority, uses it to decrypt the certificate
 * 
 * @returns {string} with the decrypted certificate
 */
const decryptCertificate = function (encryptedCertificate) {

    var k2 = new NodeRSA(globals.authorityPublicKey, 'pkcs8-public');

    return k2.decryptPublic(encryptedCertificate, 'utf8');
};


/**
 * @param {certificate} the certificate received from the authority after decryption
 * 
 * Verify the certificate by checking that the certificate after decryption has the format of 
 * a legitimate certificate, and that the common name is the id of alice
 * 
 * @returns {bool} indicating if the certificate is valid
 */
const verifyCertificate = function (certificate, id) {

    return certificate.includes("CERTIFICATE") && extractCommonNameFromCertificate(certificate) == id;

}

/**
 * @param {certificate} the certificate received from the authority after decryption
 * 
 * Extracts ElGamal public key from the certificate
 * 
 * @returns {string} ElGamal public key
 */
const extractElGamalPublicKeyFromCertificate = function (certificate) {
    var pemKey = (certificate.split("-----END CERTIFICATE-----")[1]);
    
    return keyEncoder.encodePublic(pemKey,'pem','raw');
    ;
}


const extractCommonNameFromCertificate = function (certificate) {
    return true;
}





const readAlicesMessage = function () {
    
    fileHandler.read(__dirname + ".\\..\\", "msg", "txt", function (err, fullMsg) {
        if (!err && fullMsg) {
            const msg = fullMsg.split("\n")[0];
            var S1 = fullMsg.split("\n")[1];
            var S2 = fullMsg.split("\n")[2];
            
            fileHandler.read(__dirname + "\\keys", "rsa_private", "key", function (err, key) {
                
                if (!err && key) {
                    var bob_private_key = new NodeRSA(key, 'pkcs1');
                    var decryptedMessage = bob_private_key.decrypt(msg, 'utf8');
                    
                    
                    getAliceCertificate(function (encryptedCertificate) {
                        const certificate = decryptCertificate(encryptedCertificate);
                        const isValid = verifyCertificate(certificate, globals.aliceId);
                        if (isValid) {
                            const elGamalPublicKey = extractElGamalPublicKeyFromCertificate(certificate);
                            S1=S1.replace(/(\r\n|\n|\r)/gm,"");
                            S2=S2.replace(/(\r\n|\n|\r)/gm,"");
                            elgamal.verify(decryptedMessage, globals.a, globals.q, elGamalPublicKey, bigInt(S1,16), bigInt(S2,16));
                            console.log("\n\n\n"+elGamalPublicKey+"\n\n"+decryptedMessage+"\n"+S1+"\n\n"+S2+"\n\n");
                        }
                    });
                }
            });
        }
    });
}




readAlicesMessage();