'use-strict'

var sha256 = require('fast-sha256');
var bigInt = require('big-integer');

var fs = require('fs');
var largPrime = 'largePrime.txt';
var q;

async function getQ() {
    var q;
    fs.readFile(largPrime, 'utf8', function (err, contents) {
        if (!err && contents) {
            q = bigInt(contents.replace("\n", ""), 16);
            console.log(q);
            if (q.isPrime) console.log("alooo");
        }
    });
    return q;
}


// returns the greatest common divisor of x and y
gcd = function (x, y) {
    var num_x = bigInt(x);
    var num_y = bigInt(y);
    if (num_x.equals(num_y)) return num_x;
    if (num_x < num_y) {
        while (num_x.notEquals(0)) {
            var t = num_x;
            num_x = num_y.mod(num_x);
            num_y = t;
        }
        return num_y;
    }
    else {
        while (num_y.notEquals(0)) {
            var t = num_y;
            num_y = num_x.mod(num_y);
            num_x = t;
        }
        return num_x;
    }
}

//convert Uint8Array to a single BigInt 
function buf2bigInt(buf) {
    var hex = [];
    u8 = Uint8Array.from(buf);

    u8.forEach(function (i) {
        var h = i.toString(16);
        if (h.length % 2) { h = '0' + h; }
        hex.push(h);
    });

    return BigInt('0x' + hex.join(''));
}

/**
 * 
 * @param {*} msg the message to be hashed
 * @param {*} q the global large prime
 * @param {*} a the prime generator
 * @param {*} x the private key
 */
async function elgamalDS(msg, q, a, x) {
    var hash = sha256.hash(msg);

    var m = buf2bigInt(hash);
    console.log("message hash: " + m.toString(16) + "\n");

    var q_1 = bigInt(q).minus(1);

    console.log("private key: " + x.toString(16) + "\n");

    //compute the public key:
    var y = bigInt(a).modPow(x,q);
    console.log("public key: " + y.toString(16) + "\n");

    //choose rand integer  1 < k < q-1

    var k = Math.floor(Math.random() * (10000000000 - 1) + 1);
    console.log(k)
    while (gcd(k, q_1) != 1) {
        var k = Math.floor(Math.random() * (10000000000 - 1) + 1);
    }

    console.log(k);

    //compute s1:
    var s1 = bigInt(a).modPow(k,q);
    var kInv = bigInt(k).modInv(q_1);
    console.log("K inverse is: " + kInv.toString(16) + "\n");
    console.log("s1 is: " + s1.toString(16) + "\n");

    var s2 = bigInt(bigInt(kInv).multiply(bigInt(m).minus(bigInt(x).multiply(bigInt(s1))))).mod(q_1);
    if (s2.isNegative()) {
        s2 = bigInt(s2).add(q_1);
    }
    console.log("s2 is: " + s2.toString(16));
    var signature = [s1, s2];
    return signature;
}
var globals = require('./globals');
var msg = "sfsfhsdjfksdjkfhskjdfhksiwejriwejriowejroiwejroiewjriowejroiewjroiwejroiejroiejroiwejroiwejroiwejroiwejriowjerdfhsdkjf12402jalkfjslkfwe4oithqoirfjwelfnsdkjfnksjebngkjhskjdhkajsdhkashdahfskj";
var x = bigInt("AB",16);
console.log(elgamalDS("hamada", globals.q, globals.a, x));

