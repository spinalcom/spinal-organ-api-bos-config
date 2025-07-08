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
exports.default = initExpress;
const express = require("express");
const morgan = require("morgan");
const routes_1 = require("./routes");
const https = require("https");
const fs = require("fs");
const expressMiddleware_1 = require("./middlewares/expressMiddleware");
const login_1 = require("./proxy/login");
async function initExpress(conn) {
    var app = express();
    app.use(morgan('dev'));
    (0, expressMiddleware_1.useApiMiddleWare)(app);
    (0, expressMiddleware_1.useHubProxy)(app);
    (0, login_1.useLoginProxy)(app);
    (0, expressMiddleware_1.useClientMiddleWare)(app);
    (0, expressMiddleware_1.initSwagger)(app);
    (0, login_1.useLoginProxy)(app);
    (0, expressMiddleware_1.authenticateRequest)(app);
    (0, routes_1.RegisterRoutes)(app);
    app.use(expressMiddleware_1.errorHandler);
    const serverProtocol = process.env.SERVER_PROTOCOL || "http"; // Default to http if not set
    const serverPort = process.env.SERVER_PORT || 2022;
    let server;
    // const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
    if (serverProtocol === "https") {
        // If using HTTPS, ensure SSL_KEY_PATH and SSL_CERT_PATH are set in the environment variables
        const sslOptions = { key: fs.readFileSync(process.env.SSL_KEY_PATH), cert: fs.readFileSync(process.env.SSL_CERT_PATH) };
        server = https.createServer(sslOptions, app).listen(serverPort, () => console.log(`app listening at https://localhost:${serverPort} ....`));
    }
    else if (serverProtocol === "http") {
        server = app.listen(serverPort, () => console.log(`app listening at http://localhost:${serverPort} ....`));
    }
    // await WebsocketLogs.getInstance().init(conn)
    // const ws = new WebSocketServer(server);
    // await ws.init()
    return { server, app };
}
//# sourceMappingURL=server.js.map