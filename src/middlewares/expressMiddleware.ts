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


import * as cors from 'cors';
import * as express from 'express';
import * as path from "path";
import { HTTP_CODES, SECURITY_NAME, routesToProxy } from "../constant";
var proxy = require('express-http-proxy');
import * as swaggerUi from "swagger-ui-express";
import { ValidateError } from 'tsoa';
import { AuthError } from '../security/AuthError';
import { expressAuthentication } from '../security/authentication';
import * as swaggerJSON from "../swagger/swagger.json";

const adminRoutes = Object.keys(swaggerJSON.paths);


export function useHubProxy(app: express.Express) {
    const HUB_HOST = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: function (req: any) { return req.originalUrl; }
    });

    for (const routeToProxy of routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}

export function useClientMiddleWare(app: express.Express) {
    const root = path.resolve(__dirname, '..')
    app.use(express.static(root));

    app.get("/", (req, res) => {
        res.redirect("/admin_docs");
    })
}

export function initSwagger(app: express.Express) {
    app.use("/swagger.json", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./swagger/swagger.json"));
    })

    app.get('/logo.png', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, "./assets") });
    });

    app.use("/admin_docs", swaggerUi.serve, async (req, res) => {
        return res.send(
            swaggerUi.generateHTML(await import("../swagger/swagger.json"))
        )
    }
    );
}

export function useApiMiddleWare(app: express.Express) {
    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

export function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void {
    if (err instanceof ValidateError) {
        return res.status(HTTP_CODES.BAD_REQUEST).send(_formatValidationError(err))
    }

    if (err instanceof AuthError) {
        return res.status(HTTP_CODES.UNAUTHORIZED).send({ message: err.message });
    }

    if (err instanceof Error) {
        return res.status(HTTP_CODES.INTERNAL_ERROR).json({
            message: "Internal Server Error",
        });
    }

    next();
}

export function _formatValidationError(err: ValidateError) {
    err
    return {
        message: "Validation Failed",
        details: err?.fields,
    };
}

export function authenticateRequest(app: express.Application) {
    app.all(/\/api\/v1\/*/, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let err;
        try {
            const isAdmin = isAdminRoute(req.url);
            if (isAdmin) return next();

            await expressAuthentication(req, SECURITY_NAME.profile);
        } catch (error) {
            err = error
        }
        next(err)
    })
}


function isAdminRoute(apiRoute: string): boolean {
    const route = apiRoute.includes("?") ? apiRoute.substring(0, apiRoute.indexOf('?')) : apiRoute;

    return adminRoutes.some(api => {
        const routeFormatted = api.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        const regex = new RegExp(`^${routeFormatted}$`);
        return apiRoute.match(regex);
    })
}