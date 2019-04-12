#! /bin/bash
##`openssl req * rsa:2048 -new -nodes -x509 -days 3650 -keyout a.key -out a.cert`
## Generate 30 random certificates with their private keys
for (( counter=1; counter<=20; counter++ ))
do 
    `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout $counter.key -out $counter.cert`
    
done
