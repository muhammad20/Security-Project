-- "Keys" folder contains the private and public key of the authority 
--"authority_public_key" and "authority_private_key" are the public and private keys of the authority
-- Keys are generated using openSSL with the commands
     "openssl genrsa -out authority_private.key 2048" and 
     "openssl rsa -pubout -in authority_private.key -out authority_public.key"
     run from within keys folder

--"certificates" folder contains the certificates that the authority holds with X.509 format
-- run gen_random_certs.sh to generate random certificates 
