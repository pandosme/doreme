# Mosquitto configuration
The Mosquitto configuration is located /mosquitto/config/mosquitto.conf.

## The default configuration:
Ports
  - 1883 (tcp/mqtt)
  - 1884 (WebSocket)

## Default user
The file ./mosquitto/users include a default user 'admin' with password 'pass'.

To enable this user file you must edit the conf file

```
nano ./mosquitto/config/moquitto.conf
```
Locte the line '#password_file /mosquitto/users' and remove the # in the beginning of the file.

To add or modify users you need to install moquitto on the host and use mosquitto_passwd 

Example creating user 'john'. Note that -c will create/overwrite the exsiting file
```
mosquitto_passwd -c users john
```
