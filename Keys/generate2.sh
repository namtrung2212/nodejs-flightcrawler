openssl genrsa -passout pass:1111 -des3 -out ca.key 4096

openssl req -passin pass:1111 -new -x509 -days 3650 -key ca.key -out ca.crt -subj  "/C=VN/ST=Hanoi/L=Hanoi/O=CIS/OU=Technical/CN=ca/emailAddress=namtrung2212@gmail.com"

openssl genrsa -passout pass:1111 -des3 -out server.key 4096

openssl req -passin pass:1111 -new -key server.key -out server.csr -subj  "/C=VN/ST=Hanoi/L=Hanoi/O=CIS/OU=Technical/CN=127.0.0.1/emailAddress=namtrung2212@gmail.com"

openssl x509 -req -passin pass:1111 -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt

openssl rsa -passin pass:1111 -in server.key -out server.key

openssl genrsa -passout pass:1111 -des3 -out client.key 4096

openssl req -passin pass:1111 -new -key client.key -out client.csr -subj  "/C=VN/ST=Hanoi/L=Hanoi/O=CIS/OU=Technical/CN=127.0.0.1/emailAddress=namtrung2212@gmail.com"

openssl x509 -passin pass:1111 -req -days 3650 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt

openssl rsa -passin pass:1111 -in client.key -out client.key