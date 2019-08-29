# Node-Red
TBD

## Changing password
It is recommeded to reset the password for admin and user.  This requires generating password hashes that needs to be set in /nodered/settings.js.

Generate new password hashes by logging into the container.
```
sudo docker container exec -it nodered bash
```
You should now have a prompt 'node-red@########:~$' which means you are inside the container.

Generate new password hashes.  One for 'admin' and one for 'user'
```
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" your-admin-password
```
```
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" your-user-password
```
Copy the generated hashes end exit the container by typing
```
exit
```
Open /nodered/settings.js in an editor and locate the following sections
```
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "$2a$08$j6KOwt3qoFuD/3kudLH0hO2LTxByEDSw737HnEWh3yeek4h17nq5K",
            permissions: "*"
        }]
    },
```
Replace the hash with your generated.  Do the same and for user in section
```
  httpNodeAuth: {
		user:"user",
		pass:"$2a$08$j6KOwt3qoFuD/3kudLH0hO2LTxByEDSw737HnEWh3yeek4h17nq5K"
	},
```
restart the server
```
sudo docker-compose down
sudo docker-compose up -d
```
