'use-strict'

var sha256 = require('fast-sha256');
var bigInt = require('big-integer');
var utils = require('./utils');

/**
 * 
 * @param {*} msg the message to be hashed
 * @param {*} q the global large prime
 * @param {*} a the prime generator
 * @param {*} x the private key
 */
async function elgamalDS(msg, q, a, x) {
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
var globals = require('./globals');
var x = bigInt("AB",16);
elgamalDS("hamada", globals.q, globals.a, x);

