const path = require('path');

require('dotenv').config({ override :true , path: path.resolve(__dirname, '.env') }); // Load environment variables from .env file
const port = process.env.SERVER_PORT ||  7777;

module.exports = {
  apps: [
    {
      name: `spinal-api-bos-config-${port}`,
      script: "dist/index.js",
      cwd: "."
    },
  ],
};
