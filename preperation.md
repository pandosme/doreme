# Install Docker
Docker is not part of the official Debian repo.  Before installing Docker you need to install the repository definitions for apt-get.

## Install some required packages
```
sudo apt-get update
```
```
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common
```
## Get the Docker signing key for packages
```
sudo curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
```
## Add the Docker official repos
```
sudo -i
echo "deb [arch=armhf] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
logout
```
## Install Docker
```
sudo apt-get update
```
```
sudo apt-get install -y --no-install-recommends docker-ce cgroupfs-mount
```
## Install docker-compose
Install pip:
```
sudo curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && sudo python3 get-pip.py
```
Install docker-compose
```
sudo apt-get install build-essential libssl-dev libffi-dev python3-dev
sudo pip3 install cryptography
sudo pip3 install docker-compose
```

# Start Docker
```
sudo systemctl enable docker
```

```
sudo systemctl start docker
```

# Install GIT
```
sudo apt-get install git
```
