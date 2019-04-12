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
            if(q.isPrime) console.log("alooo");
        }
    });
    return q;
}


// returns the greatest common divisor of x and y
gcd = function (x, y) {
    var num_x = bigInt(x);
    var num_y = bigInt(y);
    if(num_x.equals(num_y)) return num_x;
    if(num_x < num_y) {
        while (num_x.notEquals(0)) {
            var t = num_x;
            num_x = num_y.mod(num_x);
            num_y = t;
        }
        return num_y;
    }
    else {
        while(num_y.notEquals(0)) {
            var t = num_y;
            num_y = num_x.mod(num_y);
            num_x = t;
        }
        return num_x;
    }
}

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


async function elgamalDS(msg, q, a, X) {
    var hash = sha256.hash(msg);
    
    var m = buf2bigInt(hash);
    console.log(m);

    //compute the public key:
    var y = bigInt(pow(a, x)).mod(q);

    //choose rand integer  1 < k < q-1
    console.log(k);

    var q_1 = bigInt(q).minus(1);
    var k = Math.random() * (q_1 - 1) + 1;
    while(gcd(k,q_1) != 1) {
        var k = Math.random() * (q_1 - 1) + 1;
    }

    //compute s1:
    var s1 = bigInt(pow(a,k)).mod(q);
    var kInv = bigInt(k).modInv(q_1);

    var s2 = bigInt(kInv * (hash - X * s1)).mod(q_1);
}

var msg = "sfsfhsdjfksdjkfhskjdfhksiwejriwejriowejroiwejroiewjriowejroiewjroiwejroiejroiejroiwejroiwejroiwejroiwejriowjerdfhsdkjf12402jalkfjslkfwe4oithqoirfjwelfnsdkjfnksjebngkjhskjdhkajsdhkashdahfskj";




digitalSign = function () {

}


