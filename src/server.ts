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
import * as morgan from "morgan";
import { RegisterRoutes } from './routes';

import {
  useHubProxy,
  useClientMiddleWare,
  initSwagger,
  useApiMiddleWare,
  errorHandler,
  _formatValidationError,
  authenticateRequest
} from './middlewares/expressMiddleware';


import { useLoginProxy } from './proxy/login';

export default async function initExpress(conn: spinal.FileSystem) {

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

  const server_port = process.env.SERVER_PORT || 2022;
  const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
  // await WebsocketLogs.getInstance().init(conn)
  // const ws = new WebSocketServer(server);

  // await ws.init()

  return { server, app }

}



