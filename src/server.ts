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


import * as cors from 'cors';
import * as express from 'express';
import * as morgan from "morgan";
import * as path from "path";
import { HTTP_CODES, routesToProxy } from "./constant";
var proxy = require('express-http-proxy');
import * as swaggerUi from "swagger-ui-express";
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './routes';
import { AuthError } from './security/AuthError';

import {
  useHubProxy,
  useClientMiddleWare,
  initSwagger,
  useApiMiddleWare,
  errorHandler,
  _formatValidationError,
  authenticateRequest
} from './middlewares/expressMiddleware';


export default async function initExpress(conn: spinal.FileSystem) {

  var app = express();

  app.use(morgan('dev'));

  authenticateRequest(app)
  useHubProxy(app);
  useClientMiddleWare(app);
  initSwagger(app);
  useApiMiddleWare(app);

  // configureBosProxy(app);
  // configureBosProxy(app, true);

  RegisterRoutes(app);

  app.use(errorHandler);

  const server_port = process.env.SERVER_PORT || 2022;
  const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
  // await WebsocketLogs.getInstance().init(conn)
  // const ws = new WebSocketServer(server);

  // await ws.init()

  return { server, app }

}



