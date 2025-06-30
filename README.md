# spinal-organ-api-bos-config

Api server that handles most of possible queries to spinalhub - More secured than regular api-server.

## Installation

### Install `spinalcom-utils`
You can install `spinalcom-utils` by running the following command:
```bash
git clone https://github.com/spinalcom/spinalcom-utils.git
cd spinalcom-utils
npm install
npm link
```

For more information about spinalcom-utils, visit the [documentation](https://github.com/spinalcom/spinalcom-utils/blob/master/README.md) 

### Install `spinal-organ-api-bos-config`

You can install `spinal-organ-api-bos-config` by running the following commands:
```bash
git clone https://github.com/spinalcom/spinal-organ-api-bos-config.git
cd spinal-organ-api-bos-config
spinalcom-utils i
```

### Requirements

You must have a .env file at the root of the project with the following variables :

```bash
USER_ID=XXX
USER_MDP="XXXXXXXXXXX"
HUB_HOST=XXXXXXXX
HUB_PORT=XXXXX
HUB_PROTOCOL="XXXX"                         # http or https
SERVER_PORT="XXXX"                          # Port on which the server will listen ideally HUB_PORT+7

CONFIG_DIRECTORY_PATH="/__users__/admin/"   
CONFIG_FILE_NAME="BOSConfig"
WEBSOCKET_ALERT_TIME="60000"
ORGAN_NAME="xxxxxxxxxx"                     # Name of the organ. Used by monitoring platform.
VUE_CLIENT_URI="xxxxxxxxx"                  # URL or the web portal that expects the token from auth plateform ( spinal-apps-portail-bos )
```

## Running the api bos config

```bash
npm run start

# or with pm2 :
pm2 start dist/index.js --name spinal-organ-api-bos-config-<SERVER_PORT>
```


