## Mosquitto
```
docker run -d --rm --name broker --restart always -p 1883:1883 -p 8883:8883 -v mosquitto:/mosquitto -v certs:/certs eclipse-mosquitto
```
## Mongo
```
docker run -d --rm --name mongo --restart always -p 27017:27017 -v db:/data/db mongo
```
## Node-Red
```
docker run -d --name nodered --restart always -p 80:1880 -p 443:1880 -v nodered:/data -v certs:/certs --link broker --link mongo  nodered/node-red-docker
```
