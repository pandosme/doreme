# Overview
Node-Red is already included the official Rasbian image.  If you only need Node-Red, use that.  More information can be found on https://nodered.org.  

This repository is to simplify installation when you need Noder-Red, Mosquitto MQTT broker and a Mongo database.  Also, docker enables creating multiple instances of the three services on a single Rasberry Pi.  You can of course run this on any machine that have docker and docker-compose but it is optimized for Raspberry Pi (Mongo Database).  It includes pre-configured container for Node-Red, Mosquitto Broker and Mongo Database.  Node-red also include a number of additional common nodes such as dashboard, mongodb2 and Axis Camera.  

There is no authentication on any service.  Authentication is added for production systems by editing nodered/settings.js and mosquitto/config/mosquitto.conf.

Open docker ports:
  * 1880: Noder-red
  * 1883: Mosquitto broker
  * 27017: Mongo Database

You can adjust the port numbers by editing docker-compose.yaml 

## Install Docker & GIT
If you do not have Docker or GIT installed, read preperations.md

## Intallation
Open a terminal to your RasPi with remote SSH or local terminal console.
Go to the pi home directory (preferably) 
```
cd /home/pi
```
Clone (fetch) the repository
```
git clone https://github.com/pandosme/doreme.git 
```
Change directory
```
cd doreme
```

## Start Containers
Note: The first time executing docker-compose, docker will fetch the required containers which may take some time.
```
sudo docker-compose up -d
```
Note: if you want to see all debug output from containers, remove the '-d'.  The containers will stop when you press ctrl-c

## Stop Containers
```
sudo docker-compose down
```
