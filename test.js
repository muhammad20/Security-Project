
const globals = require('./globals');
var bigInt = require('big-integer');
const elgamal = require('./elgamal-ds');


var priv = elgamal.generatePrivateKey(globals.q);
var pub = elgamal.generatePublicKey(globals.a, priv, globals.q);
elgamal.sign("hi", globals.q, globals.a, priv.toString(16),function(signature){
    console.log(signature[0].toString());
    console.log(signature[1].toString());
    elgamal.verify ("hi", globals.a, globals.q, pub.toString(16),
    signature[0], signature[1]);
});