//var hhtp = require('http');
var bigInt = require('big-integer');
var sha256 = require('fast-sha256');
var globals = require('./../globals');
var utils = require('./../utils')

/**
 * @param {*} msg the original message received
 * @param {*} a the generator of the prime `q`
 * @param {*} q the large prime
 * @param {*} y the signer's public key
 * @param {*} s1 the first part of the pair of the signature
 * @param {*} s2 the second part of the pair of the signature
 */
verifyGamal = function (msg, a, q, y, s1, s2) {
    var mBuff = sha256.hash(msg);
    var m = utils.buf2bigInt(mBuff);

    var v1 = bigInt(a).modPow(m, q);
    if(v1.isNegative()) v1.add(q);
    var v2 = bigInt(y).modPow(s1,q).multiply(bigInt(s1).modPow(s2,q)).mod(q);
    if(v2.isNegative) v2.add(q);

    if(v1.equals(v2)) console.log("digital signature is valid! Eshta 3aleek ya Alice");
}

// a test case used @ elgamal-ds
var msg = "hamada";
var y = bigInt("4a36568d7e49913d58d9b8b4b7e16f47c800cacbb67de8292299be4160f92ebe608f5a6ccfbd04fcf28ed8aed54fa275389ff612af8f50437b634e9d9b3664a5d91982965e57eb18df921c0f287aa92e499a9ed3633cbb8107db0d434f0d3d98edb1bcfb4040e2c52f74993356d2ec5e234e820abcf764b7b5de0f2986645a04", 16);
var s1 = bigInt("9756266fccb7ad13b0df048440ae7810632f4ff740a31abab634ff7986afbfcabb59a521fc121a68d919987340e0ebec6ed25b3ad564266dbb05c33fbc189108abe294168793db8e1a3ad6eb0b652f120c1122c9e01977258e978c23f36e81df0981db0c3062436dfef89367f9d7d5116c0e161f465f12fd6c9f4cd777820935",16);
var s2 = bigInt("7dfb3b9c998c417a7362983b00d44d7a752d975c0f00f2cd075f0349e7beedca65ed84e1cebbd76f2a8a436f86432b5e8468c32aa42353c3bffdfe5f65f7ede40e9bfc622f13e9cf828fbbc63f0703160c050e14093c734d874eb3451bf607940ef3aca37809fffaa6024be95f6430edfa7e57ea5f117bf7296fff22f73c8cf5",16);
verifyGamal(msg, globals.a, globals.q, y, s1, s2);