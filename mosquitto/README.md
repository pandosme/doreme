# Mosquitto configuration
The Mosquitto configuration is /mosquitto/config/mosquitto.conf.

## The default configuration:
Ports 1883, 1884 (WebSocket), 8883 (TLS)

## TLS Certificates:
Certificates are stored under /certs and shared with Node-Red.  You should replace these certificates with your own certificates.
Check out /certs/README.md

## Default user
There is a default defined user 'admin' with password 'pass'.  This should be changed or reset the password.

### Create user
Local users are stored the file /mosquitto/users.  Add users with mosquitto_passwd.
Example creating user 'admin'. -c will create/overwrite the exsiting file
```
mosquitto_passwd -c users admin
```
