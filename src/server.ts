/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import * as express from 'express';
import * as morgan from 'morgan';
import { type Application } from 'express';
import { RegisterRoutes } from './routes';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import {
  useHubProxy,
  useClientMiddleWare,
  initSwagger,
  useApiMiddleWare,
  errorHandler,
  _formatValidationError,
  authenticateRequest,
} from './middlewares/expressMiddleware';

import { useLoginProxy } from './proxy/login';
import type { Server } from 'http';

export async function initExpress() {
  var app = express();

  app.use(morgan('dev'));

  useApiMiddleWare(app);

  useHubProxy(app);
  useLoginProxy(app);

  useClientMiddleWare(app);
  initSwagger(app);
  useLoginProxy(app);
  authenticateRequest(app);
  RegisterRoutes(app);

  app.use(errorHandler);

  return app;
}

export function initServer(app: Application): Server {
  const serverProtocol = process.env.SERVER_PROTOCOL || 'http'; // Default to http if not set
  const serverPort = process.env.SERVER_PORT || 2022;
  let server;
  // const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
  if (serverProtocol === 'https') {
    // If using HTTPS, ensure SSL_KEY_PATH and SSL_CERT_PATH are set in the environment variables
    const sslOptions = {
      key: readFileSync(process.env.SSL_KEY_PATH),
      cert: readFileSync(process.env.SSL_CERT_PATH),
    };
    server = createServer(sslOptions, app).listen(serverPort, () =>
      console.log(`app listening at https://localhost:${serverPort} ....`)
    );
  } else if (serverProtocol === 'http') {
    server = app.listen(serverPort, () =>
      console.log(`app listening at http://localhost:${serverPort} ....`)
    );
  }
  return server;
}
