# Overview
This docker-compose (optimized for Raspberry Pi) includes container for Node-Red, Mosquitto MQTT Broker and Mongo Database.  Node-red includes a number of non-default nodes such as dashboard, bigtimer and Axis device node.

There are no authentication on any service.  This can be added by editing nodered/settings.js and mosquitto/config/mosquitto.conf

Default ports in docker-compose:
1880: Noder-red
1883: Mosquitto broker
27017: Mongo Database

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

## Start Containers
Start docker containers using the appropriate yaml-file [linux.yaml] or [rpi.yaml].
Note: The first time executing docker-compose, docker will fetch the required containers which may take some time.
```
sudo docker-compose up -d
```
Note: if you want to see all debug output from containers, remove the '-d'.  The containers will stop when you press ctrl-c

## Stop Containers
```
sudo docker-compose down
```
