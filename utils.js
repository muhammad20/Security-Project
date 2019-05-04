utils = {}
var bigInt = require('big-integer');

//convert Uint8Array to a single BigInt 
utils.buf2bigInt = function(buf) {
    var hex = [];
    u8 = Uint8Array.from(buf);

    u8.forEach(function (i) {
        var h = i.toString(16);
        if (h.length % 2) { h = '0' + h; }
        hex.push(h);
    });

    return bigInt(  hex.join(''),16);
}

// returns the greatest common divisor of x and y
utils.gcd = function (x, y) {
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


module.exports = utils;