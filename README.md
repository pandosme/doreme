# Overview
Optimized for Raspberry Pi and includes pre-configured container for Node-Red, Mosquitto Broker and Mongo Database.  Node-red also include a number of additional common nodes such as Axis device node and dashboard.

There is no authentication on any service.  Authentication is added for production systems by editing nodered/settings.js and mosquitto/config/mosquitto.conf

Open docker ports:
  * 1880: Noder-red
  * 1883: Mosquitto broker
  * 27017: Mongo Database

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

### Tab 
