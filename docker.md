## Mosquitto
```
docker run -d --name broker --restart always -p 1883:1883 -p 8883:8883 -v $(pwd)/mosquitto:/mosquitto -v $(pwd)/certs:/certs eclipse-mosquitto
```
## Mongo
```
docker run -d --name mongo --restart always -u 0 -p 27017:27017 -v $(pwd)/db:/data/db mongo
```
## Node-Red
```
 docker run -d  --name nodered --restart always -u 0 -p 80:1880 -p 443:1880 -v $(pwd)/nodered:/data -v $(pwd)/certs:/certs --link broker --link mongo nodered/node-red-docker
 ```
