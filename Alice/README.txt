-- generate private key and csr
openssl req        -newkey rsa:2048 -nodes -keyout alice_private.key        -out alice_cert_req.csr
Generating a 2048 bit RSA private key

