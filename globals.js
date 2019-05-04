const globals = {};

var bigInt = require('big-integer');


globals.q=bigInt("b59dd79568817b4b9f6789822d22594f376e6a9abc0241846de426e5dd8f6eddef00b465f38f509b2b18351064704fe75f012fa346c5e2c442d7c99eac79b2bc8a202c98327b96816cb8042698ed3734643c4c05164e739cb72fba24f6156b6f47a7300ef778c378ea301e1141a6b25d48f1924268c62ee8dd3134745cdf7323",16);
globals.a=bigInt("44ec9d52c8f9189e49cd7c70253c2eb3154dd4f08467a64a0267c9defe4119f2e373388cfa350a4e66e432d638ccdc58eb703e31d4c84e50398f9f91677e88641a2d2f6157e2f4ec538088dcf5940b053c622e53bab0b4e84b1465f5738f549664bd7430961d3e5a2e7bceb62418db747386a58ff267a9939833beefb7a6fd68", 16);


globals.authorityPublicKey = "-----BEGIN PUBLIC KEY-----"+
"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm0mXmvkI2eL7e4KJKjST"+
"SAiLluCr1f1DnhWyh4JTKV1OwRzsLi19I+q0eEup5QZfX3HBucsQRUlAUzy3XC0/"+
"OEcQX3ZRKXeCnLOVO2RNQ6igRM2oSioOWldGRHV6is9MFLlDcreN9VZNW5nnCYYA"+
"ObulK4gCo8mb+nFZ0AsLhLy/9JpVrgAVq57R0t4PAI2agOfMruQTae2DorrPAtZj"+
"soe1g464l7LgKbgquxnxC2yof9NP9w9H7jOEIku6PTd1NmEIJa4u2+Y9wogPh7An"+
"Od/rEpqLj6bTWDI7N1+vxcA/PoN0Si9TT6tQ+0Z2RgmgfwTBNyg49mZ+T4JZ8Evp"+
"oQIDAQAB"+
"-----END PUBLIC KEY-----";


globals.bobId = 2;

globals.aliceId = 1;



module.exports = globals;