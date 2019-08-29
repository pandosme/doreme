# Certificates
Certificates are stored under `/certs` and shared by Node-Red and mosquitto broker.  There are default certificates in place to get TLS up and running out-of-the-box.  Using these certificate will provide TLS encryption but you will get warnings when browsing to Node-Red.  If encryption is all you need,  just add an exception at your browser client.
**You need to restart the server/services upon any changes in the `/cert` directory**
## Using Trusted CA signed certificate
It is recommeded to use trusted CA signed certificates.  You will need PEM encoded files of the CA certificate, the signed certificate and its corresponant private key.  Copy the CA Cert, certificate and the private key to the files
- ca_cert.pem
- cert.pem
- privkey.pem
## Generating a CA and certificate
If you do not have access to a CA (and do not want to use the default) you can generate a private CA and genarate a CA signed server certificate.  Open a terminal and cd to /certs.  Copy and run the following commands
### Generate CA certificate
You can use 'My CA' as the CN (Common Name).  The CA certificate (ca_cert.pem) must then be installed on your clients certificate store as a trusted issuing CA.  * In Windows, copy the file to your PC and double-click the file and follow instructions. *
```
openssl req -x509 -new -nodes -newkey rsa:2048 -keyout ca_key.pem -days 3650 -out ca_cert.pem
```
### Generate Certificate Signing Request (CSR)
It is important that you set CN (Common Name) to either your device/server IP address or FQDN (myhost.mydomain.com)
```
openssl req -new -newkey rsa:2048 -keyout privkey.pem -nodes -out cert.csr
```
### Sign your certificate with your CA
```
openssl x509 -req -in cert.csr -CA ca_cert.pem -CAkey ca_key.pem -CAcreateserial -out cert.pem -days 1825
```
### Optional remove files not needed
The following files are not needed and can be removed unless you intend to sign additional certificates.
```
rm ca_cert.srl
```
```
rm ca_key.pem
```
```
rm cert.csr
```
