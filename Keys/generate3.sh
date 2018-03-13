openssl genrsa -out server.key 2048
openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650 -subj  "/C=VN/ST=Hanoi/L=Hanoi/O=CIS/OU=Technical/CN=localhost/emailAddress=namtrung2212@gmail.com"
openssl req -new -sha256 -key server.key -out server.csr -subj "/C=VN/ST=Hanoi/L=Hanoi/O=CIS/OU=Technical/CN=localhost/emailAddress=namtrung2212@gmail.com"
openssl x509 -req -sha256 -in server.csr -signkey server.key -out server.crt -days 3650