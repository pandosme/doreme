# Overview
Installs docker container for Node-Red, Mosquitto MQTT Broker and Mongo Database.  Nore-Red is already configured and can be tweaked later.
The default user is `admin` with default password `pass`.
## Dock & GIT
If you do not have Docker or GIT isntalled, read preperations.md

## Clone respository
Go to your home directory (preferably)
```
git clone https://github.com/pandosme/visitour.git 
```
Change directory
```
cd visitour
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

## Start Visitour
Note that the first time Docker will fetch the required containers and it may take some time
```
sudo docker-compose -f rpi.yaml up
```
## Stop Visitour
```
sudo docker-compose -f rpi.yaml down
```

