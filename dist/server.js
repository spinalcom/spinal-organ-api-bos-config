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
const express = require("express");
const morgan = require("morgan");
const routes_1 = require("./routes");
const expressMiddleware_1 = require("./middlewares/expressMiddleware");
const login_1 = require("./proxy/login");
async function initExpress(conn) {
    var app = express();
    app.use(morgan('dev'));
    (0, expressMiddleware_1.useHubProxy)(app);
    (0, expressMiddleware_1.useClientMiddleWare)(app);
    (0, expressMiddleware_1.initSwagger)(app);
    (0, expressMiddleware_1.useApiMiddleWare)(app);
    (0, login_1.useLoginProxy)(app);
    (0, expressMiddleware_1.authenticateRequest)(app);
    (0, routes_1.RegisterRoutes)(app);
    app.use(expressMiddleware_1.errorHandler);
    const server_port = process.env.SERVER_PORT || 2022;
    const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
    // await WebsocketLogs.getInstance().init(conn)
    // const ws = new WebSocketServer(server);
    // await ws.init()
    return { server, app };
}
exports.default = initExpress;
//# sourceMappingURL=server.js.map