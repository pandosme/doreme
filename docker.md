Mosquitto
´´´
docker run -d -name mosquitto -p 1883:1883 -p 8883:8883 -v mosquitto:/mosquitto -v certs:/certs eclipse-mosquitto
´´´
