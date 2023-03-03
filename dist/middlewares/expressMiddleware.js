"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequest = exports._formatValidationError = exports.errorHandler = exports.useApiMiddleWare = exports.initSwagger = exports.useClientMiddleWare = exports.useHubProxy = void 0;
const cors = require("cors");
const express = require("express");
const path = require("path");
const constant_1 = require("../constant");
var proxy = require('express-http-proxy');
const swaggerUi = require("swagger-ui-express");
const tsoa_1 = require("tsoa");
const AuthError_1 = require("../security/AuthError");
const authentication_1 = require("../security/authentication");
const swaggerJSON = require("../swagger/swagger.json");
const bodyParser = require("body-parser");
const adminRoutes = Object.keys(swaggerJSON.paths);
const swaggerOption = {
    swaggerOptions: {
        swaggerDefinition: {
            info: {
                "x-logo": {
                    "url": "/admin/logo"
                },
                "x-favicon": {
                    "url": "/admin/favicon"
                }
            }
        }
    },
    customCss: '.topbar-wrapper img {content: url(/admin/logo);} .swagger-ui .topbar {background: #dbdbdb;}',
};
function useHubProxy(app) {
    const HUB_HOST = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: function (req) { return req.originalUrl; }
    });
    for (const routeToProxy of constant_1.routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}
exports.useHubProxy = useHubProxy;
function useClientMiddleWare(app) {
    const root = path.resolve(__dirname, '..');
    app.use(express.static(root));
    app.get("/", (req, res) => {
        res.redirect("/admin_docs");
    });
}
exports.useClientMiddleWare = useClientMiddleWare;
function initSwagger(app) {
    app.use("/admin/swagger.json", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../swagger/swagger.json"));
    });
    app.get('/admin/logo', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, "../../assets") });
    });
    // app.use("/admin_docs", swaggerUi.serve, async (req, res) => {
    // return res.send(swaggerUi.generateHTML(await import("../swagger/swagger.json"), swaggerOption))
    // });
    app.use("/admin_docs", swaggerUi.serve, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        return swaggerUi.setup(yield Promise.resolve().then(() => require("../swagger/swagger.json")), swaggerOption)(req, res, next);
    }));
}
exports.initSwagger = initSwagger;
function useApiMiddleWare(app) {
    app.use(cors({ origin: '*' }));
    const bodyParserTicket = bodyParser.json({ limit: '500mb' });
    // app.use((req, res, next) => {
    //     res.set('Cache-Control', 'no-store')
    //     next()
    // })
    app.use((req, res, next) => {
        if (req.originalUrl === '/api/v1/node/convert_base_64' || req.originalUrl === '/api/v1/ticket/create_ticket')
            return bodyParserTicket(req, res, next);
        return bodyParser.json()(req, res, next);
    });
    // app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}
exports.useApiMiddleWare = useApiMiddleWare;
function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        return res.status(constant_1.HTTP_CODES.BAD_REQUEST).send(_formatValidationError(err));
    }
    if (err instanceof AuthError_1.AuthError) {
        return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send({ message: err.message });
    }
    if (err instanceof Error) {
        return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).json({
            message: "Internal Server Error",
        });
    }
    next();
}
exports.errorHandler = errorHandler;
function _formatValidationError(err) {
    err;
    return {
        message: "Validation Failed",
        details: err === null || err === void 0 ? void 0 : err.fields,
    };
}
exports._formatValidationError = _formatValidationError;
function authenticateRequest(app) {
    app.all(/\/api\/v1\/*/, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let err;
        try {
            const isAdmin = isAdminRoute(req.url);
            if (isAdmin)
                return next();
            yield (0, authentication_1.expressAuthentication)(req, constant_1.SECURITY_NAME.profile);
        }
        catch (error) {
            err = error;
        }
        next(err);
    }));
}
exports.authenticateRequest = authenticateRequest;
function isAdminRoute(apiRoute) {
    const route = apiRoute.includes("?") ? apiRoute.substring(0, apiRoute.indexOf('?')) : apiRoute;
    return adminRoutes.some(api => {
        const routeFormatted = api.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        const regex = new RegExp(`^${routeFormatted}$`);
        return apiRoute.match(regex);
    });
}
//# sourceMappingURL=expressMiddleware.js.map