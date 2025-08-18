"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
require('dotenv').config({ override: true, path: path.resolve(__dirname, '../.env') });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const configFile_service_1 = require("./services/configFile.service");
const server_1 = require("./server");
const services_1 = require("./services");
const SpinalAPIMiddleware_1 = require("./middlewares/SpinalAPIMiddleware");
const spinal_organ_api_server_1 = require("spinal-organ-api-server");
const SpinalIOMiddleware_1 = require("./middlewares/SpinalIOMiddleware");
const spinal_lib_organ_monitoring_1 = require("spinal-lib-organ-monitoring");
const bootstrap_1 = require("./bootstrap");
const connect_opt = process.env.HUB_PORT
    ? `${process.env.HUB_PROTOCOL}://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}:${process.env.HUB_PORT}/`
    : `${process.env.HUB_PROTOCOL}://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}/`;
const conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
console.log(connect_opt);
configFile_service_1.configServiceInstance
    .init(conn)
    .then(async () => {
    const { app, server } = await (0, server_1.default)(conn);
    const spinalAPIMiddleware = SpinalAPIMiddleware_1.default.getInstance();
    const spinalIOMiddleware = SpinalIOMiddleware_1.default.getInstance();
    // Set the connection to the middlewares
    spinalAPIMiddleware.setConnection(conn);
    spinalIOMiddleware.setConnection(conn);
    // it is important to call this method after setting the connection to the middlewares
    // otherwise the digital twin will not be initialized correctly
    await services_1.DigitalTwinService.getInstance().getActualDigitalTwin(true);
    const log_body = Number(process.env.LOG_BODY) == 1 ? true : false;
    const { io } = await (0, spinal_organ_api_server_1.runServerRest)(server, app, spinalAPIMiddleware, spinalIOMiddleware, log_body);
    services_1.WebsocketLogsService.getInstance().setIo(io);
    await spinal_lib_organ_monitoring_1.default.init(conn, process.env.ORGAN_NAME, 'BOS_CONFIG_API', process.env.HUB_HOST, parseInt(process.env.HUB_PORT));
    if (process.env.RUN_STARTUP_TASK === '1') {
        await (0, bootstrap_1.runStartupTask)();
    }
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map