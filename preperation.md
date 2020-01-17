# Install Docker
## Become SuperUser
```
sudo -s
```

## Install some required packages
```
apt-get update
```
```
apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common
```
## Get the Docker signing key for packages
```
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
```
## Add the Docker official repos
```
 echo "deb [arch=armhf] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
```
## Install Docker
```
apt-get update
```
```
apt-get install -y --no-install-recommends docker-ce cgroupfs-mount
```
## Install docker-compose
Install pip:
```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && sudo python3 get-pip.py
```
Now install docker-compose
```
sudo pip3 install docker-compose
```

# Start Docker
```
systemctl enable docker
```
```
systemctl start docker
```

#Install GIT
```
apt install git
```
