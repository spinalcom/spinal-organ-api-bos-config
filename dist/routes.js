"use strict";
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
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const apis_controller_1 = require("./controllers/apis.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const appProfile_controller_1 = require("./controllers/appProfile.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const apps_controller_1 = require("./controllers/apps.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./controllers/auth.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const digitalTwin_controller_1 = require("./controllers/digitalTwin.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const hubSession_controller_1 = require("./controllers/hubSession.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const userProfile_controller_1 = require("./controllers/userProfile.controller");
const authentication_1 = require("./security/authentication");
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
const multer = require('multer');
const upload = multer();
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "IApiRoute": {
        "dataType": "refObject",
        "properties": {
            "group": { "dataType": "string", "required": true },
            "method": { "dataType": "string", "required": true },
            "route": { "dataType": "string", "required": true },
            "scoped": { "dataType": "string", "required": true },
            "tag": { "dataType": "string", "required": true },
        },
        "additionalProperties": { "dataType": "string" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApp": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "icon": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "categoryName": { "dataType": "string", "required": true },
            "groupName": { "dataType": "string", "required": true },
            "hasViewer": { "dataType": "boolean" },
            "documentationLink": { "dataType": "string" },
            "packageName": { "dataType": "string" },
            "isExternalApp": { "dataType": "boolean" },
            "link": { "dataType": "string" },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfileData": {
        "dataType": "refObject",
        "properties": {
            "apps": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApp" } },
            "apis": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApiRoute" } },
            "contexts": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "dataType": "any" } },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfile": {
        "dataType": "refObject",
        "properties": {
            "appsIds": { "dataType": "array", "array": { "dataType": "string" } },
            "apisIds": { "dataType": "array", "array": { "dataType": "string" } },
            "contextIds": { "dataType": "array", "array": { "dataType": "string" } },
            "name": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfileAuthEdit": {
        "dataType": "refObject",
        "properties": {
            "appsIds": { "dataType": "array", "array": { "dataType": "string" } },
            "apisIds": { "dataType": "array", "array": { "dataType": "string" } },
            "contextIds": { "dataType": "array", "array": { "dataType": "string" } },
            "name": { "dataType": "string" },
            "unauthorizeAppsIds": { "dataType": "array", "array": { "dataType": "string" } },
            "unauthorizeApisIds": { "dataType": "array", "array": { "dataType": "string" } },
            "unauthorizeContextIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationToken": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "type": { "dataType": "string" },
            "token": { "dataType": "string" },
            "createdToken": { "dataType": "double" },
            "expieredToken": { "dataType": "double" },
            "applicationId": { "dataType": "string" },
            "applicationProfileList": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "type": { "dataType": "string" },
            "token": { "dataType": "string" },
            "createdToken": { "dataType": "double" },
            "expieredToken": { "dataType": "double" },
            "userId": { "dataType": "string" },
            "userType": { "dataType": "string", "required": true },
            "userProfileList": { "dataType": "array", "array": { "dataType": "string" } },
            "serverId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCredential": {
        "dataType": "refObject",
        "properties": {
            "userName": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAppCredential": {
        "dataType": "refObject",
        "properties": {
            "clientId": { "dataType": "string", "required": true },
            "clientSecret": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOAuth2Credential": {
        "dataType": "refObject",
        "properties": {
            "client_id": { "dataType": "string", "required": true },
            "client_secret": { "dataType": "string", "required": true },
        },
        "additionalProperties": { "dataType": "string" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamCredential": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "statusPlatform": { "dataType": "string", "required": true },
            "address": { "dataType": "string", "required": true },
            "tokenPamToAdmin": { "dataType": "string", "required": true },
            "pamName": { "dataType": "string" },
            "idPlateform": { "dataType": "string" },
            "urlAdmin": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamInfo": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "url": { "dataType": "string", "required": true },
            "address": { "dataType": "string" },
            "statusPlatform": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["online"] }, { "dataType": "enum", "enums": ["fail"] }, { "dataType": "enum", "enums": ["stop"] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdmin": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "urlAdmin": { "dataType": "string", "required": true },
            "registerKey": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdminCredential": {
        "dataType": "refObject",
        "properties": {
            "TokenAdminToPam": { "dataType": "string", "required": true },
            "idPlatformOfAdmin": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTP_CODES": {
        "dataType": "refEnum",
        "enums": [200, 201, 202, 400, 401, 403, 404, 500],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/api/v1/create_bos_api_route', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.createBosApiRoute)), function APIController_createBosApiRoute(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.createBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/update_bos_api_route/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.updateBosApiRoute)), function APIController_updateBosApiRoute(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.updateBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_bos_api_route/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getBosApiRouteById)), function APIController_getBosApiRouteById(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getBosApiRouteById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_all_bos_api_route', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getAllBosApiRoute)), function APIController_getAllBosApiRoute(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getAllBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_bos_api_route/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.deleteBosApiRoute)), function APIController_deleteBosApiRoute(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "any" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.deleteBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/upload_bos_apis_routes', authenticateMiddleware([{ "bearerAuth": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.uploadBosSwaggerFile)), function APIController_uploadBosSwaggerFile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.uploadBosSwaggerFile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/app_profile/create_profile', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.createAppProfile)), function AppProfileController_createAppProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.createAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/get_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAppProfile)), function AppProfileController_getAppProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/get_all_profile', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAllAppProfile)), function AppProfileController_getAllAppProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAllAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/app_profile/edit_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.updateAppProfile)), function AppProfileController_updateAppProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfileAuthEdit" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.updateAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/app_profile/delete_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.deleteAppProfile)), function AppProfileController_deleteAppProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.deleteAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/app_profile/authorize_profile_to_access_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.authorizeProfileToAccessContext)), function AppProfileController_authorizeProfileToAccessContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "digitalTwinId": { "dataType": "string" }, "contextIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.authorizeProfileToAccessContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/app_profile/authorize_profile_to_access_apis/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.authorizeProfileToAccessApis)), function AppProfileController_authorizeProfileToAccessApis(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apiIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.authorizeProfileToAccessApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/app_profile/unauthorize_profile_to_access_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.unauthorizeProfileToAccessContext)), function AppProfileController_unauthorizeProfileToAccessContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "digitalTwinId": { "dataType": "string" }, "contextIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.unauthorizeProfileToAccessContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/app_profile/unauthorize_profile_to_access_apis/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.unauthorizeProfileToAccessApis)), function AppProfileController_unauthorizeProfileToAccessApis(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apiIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.unauthorizeProfileToAccessApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/profile_has_access_to_context/:profileId/:contextId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.profileHasAccessToContext)), function AppProfileController_profileHasAccessToContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            contextId: { "in": "path", "name": "contextId", "required": true, "dataType": "string" },
            digitalTwinId: { "in": "query", "name": "digitalTwinId", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.profileHasAccessToContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/profile_has_access_to_api/:profileId/:apiId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.profileHasAccessToApi)), function AppProfileController_profileHasAccessToApi(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            apiId: { "in": "path", "name": "apiId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.profileHasAccessToApi.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/get_authorized_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedContexts)), function AppProfileController_getAuthorizedContexts(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            digitalTwinId: { "in": "query", "name": "digitalTwinId", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedContexts.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/app_profile/get_authorized_apis/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedApis)), function AppProfileController_getAuthorizedApis(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/create_admin_app', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.createAdminApp)), function AppsController_createAdminApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appInfo: { "in": "body", "name": "appInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.createAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/create_building_app', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.createBuildingApp)), function AppsController_createBuildingApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appInfo: { "in": "body", "name": "appInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.createBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_all_admin_apps', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAllAdminApps)), function AppsController_getAllAdminApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAllAdminApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_all_building_apps', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAllBuildingApps)), function AppsController_getAllBuildingApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAllBuildingApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_admin_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAdminApp)), function AppsController_getAdminApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_building_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getBuildingApp)), function AppsController_getBuildingApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/update_admin_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.updateAdminApp)), function AppsController_updateAdminApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
            newInfo: { "in": "body", "name": "newInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.updateAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/update_building_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.updateBuildingApp)), function AppsController_updateBuildingApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
            newInfo: { "in": "body", "name": "newInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.updateBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_admin_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.deleteAdminApp)), function AppsController_deleteAdminApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.deleteAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_building_app/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.deleteBuildingApp)), function AppsController_deleteBuildingApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.deleteBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/upload_admin_apps', authenticateMiddleware([{ "bearerAuth": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.uploadAdminApp)), function AppsController_uploadAdminApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.uploadAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/upload_building_apps', authenticateMiddleware([{ "bearerAuth": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.uploadBuildingApp)), function AppsController_uploadBuildingApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.uploadBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_favorite_apps', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getFavoriteApps)), function AppsController_getFavoriteApps(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getFavoriteApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/add_app_to_favoris', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.addAppToFavoris)), function AppsController_addAppToFavoris(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "appIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.addAppToFavoris.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/remove_app_from_favoris', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.removeAppFromFavoris)), function AppsController_removeAppFromFavoris(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "appIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.removeAppFromFavoris.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/auth', authenticateMiddleware([{ "all": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.authenticate)), function AuthController_authenticate(request, response, next) {
        const args = {
            credential: { "in": "body", "name": "credential", "required": true, "dataType": "union", "subSchemas": [{ "ref": "IUserCredential" }, { "ref": "IAppCredential" }, { "ref": "IOAuth2Credential" }] },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.authenticate.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/register_admin', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.registerToAdmin)), function AuthController_registerToAdmin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "adminInfo": { "ref": "IAdmin", "required": true }, "pamInfo": { "ref": "IPamInfo", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.registerToAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_bos_to_auth_credential', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.getBosToAdminCredential)), function AuthController_getBosToAdminCredential(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.getBosToAdminCredential.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_admin', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.deleteAdmin)), function AuthController_deleteAdmin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.deleteAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_admin_to_bos_credential', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.getAdminCredential)), function AuthController_getAdminCredential(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.getAdminCredential.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/update_data', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.syncDataToAdmin)), function AuthController_syncDataToAdmin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.syncDataToAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/getTokenData', authenticateMiddleware([{ "all": [] }]), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.tokenIsValid)), function AuthController_tokenIsValid(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "token": { "dataType": "string", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.tokenIsValid.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/add_digitaltwin', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.addDigitalTwin)), function DigitaltwinController_addDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "url": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } } },
            set_as_actual_digitaltwin: { "in": "query", "name": "set_as_actual_digitaltwin", "dataType": "boolean" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.addDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_all_digitaltwins', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.getAllDigitalTwins)), function DigitaltwinController_getAllDigitalTwins(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.getAllDigitalTwins.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_digitaltwin/:digitaltwinId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.getDigitalTwin)), function DigitaltwinController_getDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            digitaltwinId: { "in": "path", "name": "digitaltwinId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.getDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/set_as_actual_digitaltwin/:digitaltwinId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.setActualDigitalTwin)), function DigitaltwinController_setActualDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            digitaltwinId: { "in": "path", "name": "digitaltwinId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.setActualDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_actual_digitaltwin', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.getActualDigitalTwin)), function DigitaltwinController_getActualDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.getActualDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_digitaltwin_contexts', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.getDefaultDigitalTwinContexts)), function DigitaltwinController_getDefaultDigitalTwinContexts(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.getDefaultDigitalTwinContexts.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/get_digitaltwin_contexts/:digitaltwinId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.getDigitalTwinContexts)), function DigitaltwinController_getDigitalTwinContexts(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            digitaltwinId: { "in": "path", "name": "digitaltwinId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.getDigitalTwinContexts.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/update_digitaltwin/:digitaltwinId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.editDigitalTwin)), function DigitaltwinController_editDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            digitaltwinId: { "in": "path", "name": "digitaltwinId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "url": { "dataType": "string" }, "name": { "dataType": "string" } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.editDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_digitaltwin/:digitaltwinId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.removeDigitalTwin)), function DigitaltwinController_removeDigitalTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            digitaltwinId: { "in": "path", "name": "digitaltwinId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.removeDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/delete_actual_digitaltwin', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.removeActualDigitaTwin)), function DigitaltwinController_removeActualDigitaTwin(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.removeActualDigitaTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/createSession', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(hubSession_controller_1.HubSessionController)), ...((0, runtime_1.fetchMiddlewares)(hubSession_controller_1.HubSessionController.prototype.createSession)), function HubSessionController_createSession(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new hubSession_controller_1.HubSessionController();
            const promise = controller.createSession.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/user_profile/create_profile', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.createUserProfile)), function UserProfileController_createUserProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.createUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getUserProfile)), function UserProfileController_getUserProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_profile', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getUserProfileByToken)), function UserProfileController_getUserProfileByToken(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getUserProfileByToken.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_all_profile', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAllUserProfile)), function UserProfileController_getAllUserProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAllUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/user_profile/edit_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.updateUserProfile)), function UserProfileController_updateUserProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfileAuthEdit" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.updateUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/user_profile/delete_profile/:id', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.deleteUserProfile)), function UserProfileController_deleteUserProfile(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.deleteUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_authorized_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedContexts)), function UserProfileController_getAuthorizedContexts(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            digitalTwinId: { "in": "query", "name": "digitalTwinId", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedContexts.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_authorized_apps/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedApps)), function UserProfileController_getAuthorizedApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/get_authorized_admin_apps/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedAdminApps)), function UserProfileController_getAuthorizedAdminApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedAdminApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/user_profile/authorize_profile_to_access_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.authorizeProfileToAccessContext)), function UserProfileController_authorizeProfileToAccessContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "digitalTwinId": { "dataType": "string" }, "contextIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.authorizeProfileToAccessContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/user_profile/authorize_profile_to_access_apps/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.authorizeProfileToAccessApps)), function UserProfileController_authorizeProfileToAccessApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "appIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.authorizeProfileToAccessApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/user_profile/unauthorize_profile_to_access_contexts/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.unauthorizeProfileToAccessContext)), function UserProfileController_unauthorizeProfileToAccessContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "digitalTwinId": { "dataType": "string" }, "contextIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.unauthorizeProfileToAccessContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/user_profile/unauthorize_profile_to_access_apps/:profileId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.unauthorizeProfileToAccessApps)), function UserProfileController_unauthorizeProfileToAccessApps(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "appIds": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "array", "array": { "dataType": "string" } }], "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.unauthorizeProfileToAccessApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/profile_has_access_to_context/:profileId/:contextId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.profileHasAccessToContext)), function UserProfileController_profileHasAccessToContext(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            contextId: { "in": "path", "name": "contextId", "required": true, "dataType": "string" },
            digitalTwinId: { "in": "query", "name": "digitalTwinId", "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.profileHasAccessToContext.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/user_profile/profile_has_access_to_app/:profileId/:appId', authenticateMiddleware([{ "bearerAuth": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.profileHasAccessToApp)), function UserProfileController_profileHasAccessToApp(request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.profileHasAccessToApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return function runAuthenticationMiddleware(request, _response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                // keep track of failed auth attempts so we can hand back the most
                // recent one.  This behavior was previously existing so preserving it
                // here
                const failedAttempts = [];
                const pushAndRethrow = (error) => {
                    failedAttempts.push(error);
                    throw error;
                };
                const secMethodOrPromises = [];
                for (const secMethod of security) {
                    if (Object.keys(secMethod).length > 1) {
                        const secMethodAndPromises = [];
                        for (const name in secMethod) {
                            secMethodAndPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                            .then(users => { return users[0]; }));
                    }
                    else {
                        for (const name in secMethod) {
                            secMethodOrPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                    }
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                try {
                    request['user'] = yield promiseAny(secMethodOrPromises);
                    next();
                }
                catch (err) {
                    // Show most recent error as response
                    const error = failedAttempts.pop();
                    error.status = error.status || 401;
                    next(error);
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            });
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map