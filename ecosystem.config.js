require('dotenv').config(); // Load environment variables from .env file

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
