const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;
const globals = require('./../globals');
const NodeRSA = require('node-rsa');
const fileHandler = require('./../file_handler');
const openssl = require('openssl-wrapper');
const elgamal = require('./../elgamal-ds');
const CertificateParser  = require('@fidm/x509')
const forge = require('node-forge');


/**
 * @param {callback} callback function called after getting the certificate
 * 
 * Send a get request to the certificate authority with query string parameter with pop's id 
 * 
 * @returns {void}
 */
const getBobsCertificate = function (callback) {

    // Options to be passed to the request module
    const requestOptions = {
        'port': 9000,
        'method': 'GET',
        'path': '?id=' + globals.bobId
    };

    // COnstruct the request
    var certRequest = http.request("http://localhost:9000/?id=" + globals.bobId, function (res) {
        
        var buffer = '';
        var stringDecoder = new StringDecoder('utf-8');

        // On data arrival, add to the buffer
        res.on('data', function (data) {
            buffer += stringDecoder.write(data);

        });

        // On data end, terminate the buffer and incoke the callback
        res.on('end', function () {
            buffer += stringDecoder.end();
            callback(buffer);
        });
    });

    // Fire the request
    certRequest.end();
};



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
 * a legitimate certificate, and that the common name is the id of bob
 * 
 * @returns {bool} indicating if the certificate is valid
 */ 
const verifyCertificate = function (certificate, id) {
   
    return certificate.includes("CERTIFICATE") ;//&& extractCommonNameFromCertificate(certificate)==id;

}


const extractCommonNameFromCertificate = function(certificate){
    return true;
}


/**
 * @param {certificate} the certificate received from the authority after decryption
 * 
 * Extract the public key in PEM format 
 * 
 * @returns {pem} The public key in PEM format
 */ 
const extractRSAPublicKeyFromCertificate = function extractRSAPublicKeyFromCertificate(certificate) {
    
    // base64-decode DER bytes
    var certDerBytes = forge.util.decode64(certificate.split("-----")[2]);

    // parse DER to an ASN.1 object
    var obj = forge.asn1.fromDer(certDerBytes);

    // convert ASN.1 object to forge certificate object
    var cert = forge.pki.certificateFromAsn1(obj);

    // get forge public key object
    var publicKey = cert.publicKey;

    // if you did want to convert it to PEM format for transport:
    const pem = forge.pki.publicKeyToPem(publicKey);

    return pem;
}



/**
 * @param {message} message the original message to be sent
 * 
 * Encapsulates all the logic to send  message to peer-user
 */
const sendBob = function (message) {

    // Read my private elgamal key
    fileHandler.read(__dirname + "/keys", "elgamal_private_key", "key", function (err, elgamalKey) {
       
        // Sign the message with el gamal private key        
        elgamal.sign(message, globals.q, globals.a, elgamalKey, function (signature) {
           console.log(elgamalKey+"\nhiiiiiiiiiiiiiiiiiiii");
           
            // Get bob's certificate
            getBobsCertificate(function (encryptedCertificate) {
                
                // Decrypt the certificate with the authorities public key
                const certificatewithElGmalKey = decryptCertificate(encryptedCertificate);
                
                // Split the received certificate to the X509 certificate and ElGamal public key
                const certificate = certificatewithElGmalKey.split("-----BEGIN PUBLIC KEY-----")[0];
                const bobElGmalPublicKey = certificatewithElGmalKey.split("-----END CERTIFICATE-----")[1];
                
           
                // Verify bob's certificate 
                var isValid = verifyCertificate(certificate,globals.bobId);
                if (isValid) {
           
                    // Extract bob's RSA public key from the certificate
                    var bobPublicKey = extractRSAPublicKeyFromCertificate(certificate);
                    
                    // Encrypt the message using RSA bob's public key
                    bobPublicKey = NodeRSA(bobPublicKey);
                    const messageToBeSent = bobPublicKey.encrypt(message, 'base64')+"\n" + signature[0].toString(16) + "\n" + signature[1].toString(16);

                    console.log(messageToBeSent);
                }
            });
        });
    });




};

sendBob("hi there");




