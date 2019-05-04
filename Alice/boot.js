globals = require('../globals');
fileHandler = require('./../file_handler');
var KeyEncoder = require('key-encoder'),
keyEncoder = new KeyEncoder('secp256k1')

// Generate el gamal private and public keys
const elgamalEngine = require('../elgamal-ds');
const elgamalPrivateKey = elgamalEngine.generatePrivateKey(globals.q);
const elgamalPublicKey = elgamalEngine.generatePublicKey(globals.a, elgamalPrivateKey, globals.q);
const elgamalPrivateKeyString = keyEncoder.encodePublic(elgamalPrivateKey.toString(16), 'raw', 'pem').replace('\"','');
const elgamalPublicKeyString = keyEncoder.encodePublic(elgamalPublicKey.toString(16), 'raw', 'pem');

async function externKeys() {
    await fileHandler.create(__dirname+"/keys", "elgamal_private_key", "key", elgamalPrivateKey.toString(16).replace('\"',""), function (err,data) {});
    await fileHandler.create(__dirname+"/keys", "elgamal_public_key", "key", elgamalPublicKey.toString(16).replace('\"',""), function (err, data) { });
}
externKeys();

// Generate RSA private and public keys 
const ch = require('child_process');
ch.spawnSync('openssl', ['genrsa', '-out', 'keys/rsa_private.key', '2048']);
ch.spawnSync('openssl', ['rsa', '-pubout', '-in', 'keys/rsa_private.key', '-out', 'keys/rsa_public.key']);


// Generate the certificate signing request (self-signed)
ch.spawnSync('openssl', ['req', '-key', 'keys/rsa_private.key', '-new', '-x509', '-days', '365', '-out', '../authority/certificates/' + globals.aliceId + '.crt', '-subj', '/C=US/ST=NRW/L=Earth/O=CompanyName/OU=IT/CN=' + globals.aliceId + '/emailAddress=email@example.com']);
fileHandler.read(__dirname+"/../authority/certificates/",globals.aliceId, "crt", function(err,data){
    console.log(err);
    fileHandler.update(__dirname+"/../authority/certificates/",globals.aliceId, "crt", 
        (data+elgamalPublicKeyString).replace('\"',''),
        function(err){
            console.log(data+elgamalPublicKeyString);
            console.log(err);
        });
});

// Send the certificate to the authority to be signed (encrypted) and saved at the authority
