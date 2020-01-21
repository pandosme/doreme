# Overview
Node-Red is already included the official Rasbian image.  If you only need Node-Red, use that.  More information can be found on https://nodered.org.  

This repository is to simplify installation when you need Noder-Red, Mosquitto MQTT broker and a Mongo database.  Also, docker enables creating multiple instances of the three services on a single Rasberry Pi.  You can of course run this on any machine that have docker and docker-compose but it is optimized for Raspberry Pi (Mongo Database).  It includes pre-configured container for Node-Red, Mosquitto Broker and Mongo Database.  Node-red also include a number of additional common nodes such as Axis device node and dashboard.  Some flows examples are alos included.  You can remove them if you do not need them. 

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
## Examples
To view and edit flows, go to http://<raspi-ip>:1880.  The dashboard is accessed on http://<raspi-ip>:1880/ui

### MQTT
A dashboard form that publish to the local broker and a dashboard template that shows a subscription

### Camera
Dashboard controls that interacts with an Axis camera using the Axis device node.  Double-click the node to set camera address, credentials, select the desired operation and desired output format.  The info tabs includes more information of inputs and outputs.

  - Show snapshot
  - Show Camera properies
  - Slider to control color level
  - Text input that updates image text overlay

### Database
Dashboard form and list that interacts with the local Mongo Database

### API
Example showing how to add a simple http api in Node-Red

