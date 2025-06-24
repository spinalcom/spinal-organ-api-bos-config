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

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
import { spinalCore } from 'spinal-core-connectorjs_type';
import { configServiceInstance } from './services/configFile.service';
import expressServer from './server';
import { DigitalTwinService, WebsocketLogsService } from './services';
import SpinalAPIMiddleware from './middlewares/SpinalAPIMiddleware';
import { runServerRest } from 'spinal-organ-api-server';
import SpinalIOMiddleware from './middlewares/SpinalIOMiddleware';
import ConfigFile from 'spinal-lib-organ-monitoring';

const connect_opt = process.env.HUB_PORT
  ? `${process.env.HUB_PROTOCOL}://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}:${process.env.HUB_PORT}/`
  : `${process.env.HUB_PROTOCOL}://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}/`;
const conn = spinalCore.connect(connect_opt);
console.log(connect_opt);

configServiceInstance
  .init(conn)
  .then(async () => {
    const { app, server } = await expressServer(conn);
    await DigitalTwinService.getInstance().getActualDigitalTwin(true);

    const spinalAPIMiddleware = SpinalAPIMiddleware.getInstance(conn);
    const spinalIOMiddleware = SpinalIOMiddleware.getInstance(conn);

    const log_body = Number(process.env.LOG_BODY) == 1 ? true : false;

    const { io } = await runServerRest(
      server,
      app,
      spinalAPIMiddleware,
      spinalIOMiddleware,
      log_body
    );

    WebsocketLogsService.getInstance().setIo(io);
    await ConfigFile.init(
      conn,
      process.env.ORGAN_NAME,
      'BOS_CONFIG_API',
      process.env.HUB_HOST,
      parseInt(process.env.HUB_PORT)
    );
  })
  .catch((err: Error) => {
    console.error(err);
  });
