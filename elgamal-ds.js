'use-strict'

var sha256 = require('fast-sha256');
var bigInt = require('big-integer');
var utils = require('./utils');

const elgamal = {};

/**
 * 
 * @param {*} msg the message to be hashed
 * @param {*} q the global large prime
 * @param {*} a the prime generator
 * @param {*} x the private key
 */
elgamal.sign = async function elgamalDS(msg, q, a, x) {
    var hash = sha256.hash(msg);

    var m = utils.buf2bigInt(hash);
    console.log("message hash: " + m.toString(16) + "\n");

    var q_1 = bigInt(q).minus(1);

    console.log("private key: " + x.toString(16) + "\n");

    //compute the public key:
    var y = bigInt(a).modPow(x,q);
    console.log("public key: " + y.toString(16) + "\n");

    //choose rand integer  1 < k < q-1

    var k = Math.floor(Math.random() * (10000000000 - 1) + 1);
    while (utils.gcd(k, q_1) != 1) {
        var k = Math.floor(Math.random() * (10000000000 - 1) + 1);
        console.log(k);
    }

    console.log(k);

    //compute s1:
    var s1 = bigInt(a).modPow(k,q);
    var kInv = bigInt(k).modInv(q_1);
    console.log("K inverse is: " + kInv.toString(16) + "\n");
    console.log("s1 is: " + s1.toString(16) + "\n");

    //compute s2:
    var s2 = bigInt(bigInt(kInv).multiply(bigInt(m).minus(bigInt(x).multiply(bigInt(s1))))).mod(q_1);
    if (s2.isNegative()) {
        s2 = bigInt(s2).add(q_1);
    }
    console.log("s2 is: " + s2.toString(16));
    var signature = [s1, s2];
    return signature;
}

/**
 * @param {*} msg the original message received
 * @param {*} a the generator of the prime `q`
 * @param {*} q the large prime
 * @param {*} y the signer's public key
 * @param {*} s1 the first part of the pair of the signature
 * @param {*} s2 the second part of the pair of the signature
 */
elgamal.verify = function (msg, a, q, y, s1, s2) {
    var mBuff = sha256.hash(msg);
    var m = utils.buf2bigInt(mBuff);

    var v1 = bigInt(a).modPow(m, q);
    if(v1.isNegative()) v1.add(q);
    var v2 = bigInt(y).modPow(s1,q).multiply(bigInt(s1).modPow(s2,q)).mod(q);
    if(v2.isNegative) v2.add(q);

    if(v1.equals(v2)) console.log("digital signature is valid! Eshta 3aleek ya Alice");
}

elgamal.generatePrivateKey = function(q) {
    var key = Math.floor(Math.random() * (bigInt(q).minus(1) - 1) + 1);
    console.log("generated private key is : " + bigInt(key).toString(16) + "\n");
    return key;
}

elgamal.generatePublicKey = function(a, privateKey, q) {
    var publicKey = bigInt(a).modPow(privateKey, q);
    console.log("generated public key is : " + publicKey.toString(16) + "\n");
    return publicKey;
}

var globals = require('./globals');
var x = bigInt("AB",16);
elgamal.sign("hamada", globals.q, globals.a, x);
var privateKey = elgamal.generatePrivateKey(globals.q);
elgamal.generatePublicKey(globals.a, privateKey, globals.q);
module.exports = elgamal;

