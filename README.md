# Overview
Installs docker container for Node-Red, Mosquitto MQTT Broker and Mongo Database.  Nore-Red is already configured and can be tweaked later.
The default user is `admin` with default password `pass`.
## Docker & GIT
If you do not have Docker or GIT installed, read preperations.md

## Clone respository
Go to your home directory (preferably)
```
git clone https://github.com/pandosme/doreme.git 
```
Change directory
```
cd doreme
```

## Default settings
There are default settings, containing default passwords and certificates that needs to be set by copying some default files.  These files will be upsted when resetting passwords and installing CA-signed certificates.

Default user/password for both Node-Red & Mosquitto is admin/pass
```
cp nodered/default/* nodered
```
```
cp mosquitto/default/* mosquitto
```
```
cp certs/default/* certs
```

## Start Containers
Start docker containers using the appropriate yaml-file [linux.yaml] or [rpi.yaml].
Note: The first time executing docker-compose, docker will fetch the required containers which may take some time.
```
sudo docker-compose -f rpi.yaml up

or

sudo docker-compose -f linux.yaml up
```
## Stop Containers
```
sudo docker-compose -f [platform].yaml down
```
