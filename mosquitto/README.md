# Mosquitto configuration
The Mosquitto configuration is located /mosquitto/config/mosquitto.conf.

## The default configuration:
Ports
  - 1883 (tcp/mqtt)
  - 1884 (WebSocket)

## Default user
The file /mosquitto/users include a default user 'admin' with password 'pass'.  To enable this you must remove the comment (#) 

### Create user
Local users are stored the file /mosquitto/users.  Add users with mosquitto_passwd.
Example creating user 'admin'. -c will create/overwrite the exsiting file
```
mosquitto_passwd -c users admin
```
