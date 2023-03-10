/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { APIController } from './controllers/apis.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AppProfileController } from './controllers/appProfile.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AppsController } from './controllers/apps.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './controllers/auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DigitaltwinController } from './controllers/digitalTwin.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserProfileController } from './controllers/userProfile.controller';
import { expressAuthentication } from './security/authentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler } from 'express';
import * as express from 'express';
const multer = require('multer');
const upload = multer();

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IApiRoute": {
        "dataType": "refObject",
        "properties": {
            "group": {"dataType":"string","required":true},
            "method": {"dataType":"string","required":true},
            "route": {"dataType":"string","required":true},
            "scoped": {"dataType":"string","required":true},
            "tag": {"dataType":"string","required":true},
        },
        "additionalProperties": {"dataType":"string"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApp": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "icon": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "tags": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "categoryName": {"dataType":"string","required":true},
            "groupName": {"dataType":"string","required":true},
            "hasViewer": {"dataType":"boolean"},
            "packageName": {"dataType":"string"},
            "isExternalApp": {"dataType":"boolean"},
            "link": {"dataType":"string"},
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfileData": {
        "dataType": "refObject",
        "properties": {
            "apps": {"dataType":"array","array":{"dataType":"refObject","ref":"IApp"}},
            "apis": {"dataType":"array","array":{"dataType":"refObject","ref":"IApiRoute"}},
            "contexts": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfile": {
        "dataType": "refObject",
        "properties": {
            "appsIds": {"dataType":"array","array":{"dataType":"string"}},
            "apisIds": {"dataType":"array","array":{"dataType":"string"}},
            "contextIds": {"dataType":"array","array":{"dataType":"string"}},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfileAuthEdit": {
        "dataType": "refObject",
        "properties": {
            "appsIds": {"dataType":"array","array":{"dataType":"string"}},
            "apisIds": {"dataType":"array","array":{"dataType":"string"}},
            "contextIds": {"dataType":"array","array":{"dataType":"string"}},
            "name": {"dataType":"string"},
            "unauthorizeAppsIds": {"dataType":"array","array":{"dataType":"string"}},
            "unauthorizeApisIds": {"dataType":"array","array":{"dataType":"string"}},
            "unauthorizeContextIds": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationToken": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "token": {"dataType":"string"},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "applicationId": {"dataType":"string"},
            "applicationProfileList": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "token": {"dataType":"string"},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "userId": {"dataType":"string"},
            "userType": {"dataType":"string","required":true},
            "userProfileList": {"dataType":"array","array":{"dataType":"string"}},
            "serverId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCredential": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAppCredential": {
        "dataType": "refObject",
        "properties": {
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOAuth2Credential": {
        "dataType": "refObject",
        "properties": {
            "client_id": {"dataType":"string","required":true},
            "client_secret": {"dataType":"string","required":true},
        },
        "additionalProperties": {"dataType":"string"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamCredential": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "statusPlatform": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "tokenPamToAdmin": {"dataType":"string","required":true},
            "pamName": {"dataType":"string"},
            "idPlateform": {"dataType":"string"},
            "urlAdmin": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamInfo": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "address": {"dataType":"string"},
            "statusPlatform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["online"]},{"dataType":"enum","enums":["fail"]},{"dataType":"enum","enums":["stop"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdmin": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "urlAdmin": {"dataType":"string","required":true},
            "registerKey": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdminCredential": {
        "dataType": "refObject",
        "properties": {
            "TokenAdminToPam": {"dataType":"string","required":true},
            "idPlatformOfAdmin": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTP_CODES": {
        "dataType": "refEnum",
        "enums": [200,201,202,400,401,403,404,500],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/api/v1/create_bos_api_route',
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.createBosApiRoute)),

            function APIController_createBosApiRoute(request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    data: {"in":"body","name":"data","required":true,"ref":"IApiRoute"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.createBosApiRoute.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/update_bos_api_route/:id',
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.updateBosApiRoute)),

            function APIController_updateBosApiRoute(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IApiRoute"},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.updateBosApiRoute.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_bos_api_route/:id',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.getBosApiRouteById)),

            function APIController_getBosApiRouteById(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.getBosApiRouteById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_all_bos_api_route',
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.getAllBosApiRoute)),

            function APIController_getAllBosApiRoute(request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.getAllBosApiRoute.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_bos_api_route/:id',
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.deleteBosApiRoute)),

            function APIController_deleteBosApiRoute(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.deleteBosApiRoute.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/upload_bos_apis_routes',
            upload.single('file'),
            ...(fetchMiddlewares<RequestHandler>(APIController)),
            ...(fetchMiddlewares<RequestHandler>(APIController.prototype.uploadBosSwaggerFile)),

            function APIController_uploadBosSwaggerFile(request: any, response: any, next: any) {
            const args = {
                    file: {"in":"formData","name":"file","required":true,"dataType":"file"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new APIController();


              const promise = controller.uploadBosSwaggerFile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/app_profile/create_profile',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.createAppProfile)),

            function AppProfileController_createAppProfile(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IProfile"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.createAppProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/get_profile/:id',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.getAppProfile)),

            function AppProfileController_getAppProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.getAppProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/get_all_profile',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.getAllAppProfile)),

            function AppProfileController_getAllAppProfile(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.getAllAppProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/app_profile/edit_profile/:id',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.updateAppProfile)),

            function AppProfileController_updateAppProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"ref":"IProfileAuthEdit"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.updateAppProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/app_profile/delete_profile/:id',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.deleteAppProfile)),

            function AppProfileController_deleteAppProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.deleteAppProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/app_profile/authorize_profile_to_access_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.authorizeProfileToAccessContext)),

            function AppProfileController_authorizeProfileToAccessContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"digitalTwinId":{"dataType":"string"},"contextIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.authorizeProfileToAccessContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/app_profile/authorize_profile_to_access_apis/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.authorizeProfileToAccessApis)),

            function AppProfileController_authorizeProfileToAccessApis(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"apiIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.authorizeProfileToAccessApis.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/app_profile/unauthorize_profile_to_access_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.unauthorizeProfileToAccessContext)),

            function AppProfileController_unauthorizeProfileToAccessContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"digitalTwinId":{"dataType":"string"},"contextIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.unauthorizeProfileToAccessContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/app_profile/unauthorize_profile_to_access_apis/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.unauthorizeProfileToAccessApis)),

            function AppProfileController_unauthorizeProfileToAccessApis(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"apiIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.unauthorizeProfileToAccessApis.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/profile_has_access_to_context/:profileId/:contextId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.profileHasAccessToContext)),

            function AppProfileController_profileHasAccessToContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    contextId: {"in":"path","name":"contextId","required":true,"dataType":"string"},
                    digitalTwinId: {"in":"query","name":"digitalTwinId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.profileHasAccessToContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/profile_has_access_to_api/:profileId/:apiId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.profileHasAccessToApi)),

            function AppProfileController_profileHasAccessToApi(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    apiId: {"in":"path","name":"apiId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.profileHasAccessToApi.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/get_authorized_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.getAuthorizedContexts)),

            function AppProfileController_getAuthorizedContexts(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    digitalTwinId: {"in":"query","name":"digitalTwinId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.getAuthorizedContexts.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/app_profile/get_authorized_apis/:profileId',
            ...(fetchMiddlewares<RequestHandler>(AppProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AppProfileController.prototype.getAuthorizedApis)),

            function AppProfileController_getAuthorizedApis(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppProfileController();


              const promise = controller.getAuthorizedApis.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/create_admin_app',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.createAdminApp)),

            function AppsController_createAdminApp(request: any, response: any, next: any) {
            const args = {
                    appInfo: {"in":"body","name":"appInfo","required":true,"ref":"IApp"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.createAdminApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/create_building_app',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.createBuildingApp)),

            function AppsController_createBuildingApp(request: any, response: any, next: any) {
            const args = {
                    appInfo: {"in":"body","name":"appInfo","required":true,"ref":"IApp"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.createBuildingApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_all_admin_apps',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.getAllAdminApps)),

            function AppsController_getAllAdminApps(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.getAllAdminApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_all_building_apps',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.getAllBuildingApps)),

            function AppsController_getAllBuildingApps(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.getAllBuildingApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_admin_app/:appId',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.getAdminApp)),

            function AppsController_getAdminApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.getAdminApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_building_app/:appId',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.getBuildingApp)),

            function AppsController_getBuildingApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.getBuildingApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/update_admin_app/:appId',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.updateAdminApp)),

            function AppsController_updateAdminApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
                    newInfo: {"in":"body","name":"newInfo","required":true,"ref":"IApp"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.updateAdminApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/update_building_app/:appId',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.updateBuildingApp)),

            function AppsController_updateBuildingApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
                    newInfo: {"in":"body","name":"newInfo","required":true,"ref":"IApp"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.updateBuildingApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_admin_app/:appId',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.deleteAdminApp)),

            function AppsController_deleteAdminApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.deleteAdminApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_building_app/:appId',
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.deleteBuildingApp)),

            function AppsController_deleteBuildingApp(request: any, response: any, next: any) {
            const args = {
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.deleteBuildingApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/upload_admin_apps',
            upload.single('file'),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.uploadAdminApp)),

            function AppsController_uploadAdminApp(request: any, response: any, next: any) {
            const args = {
                    file: {"in":"formData","name":"file","required":true,"dataType":"file"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.uploadAdminApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/upload_building_apps',
            upload.single('file'),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.uploadBuildingApp)),

            function AppsController_uploadBuildingApp(request: any, response: any, next: any) {
            const args = {
                    file: {"in":"formData","name":"file","required":true,"dataType":"file"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.uploadBuildingApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_favorite_apps',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.getFavoriteApps)),

            function AppsController_getFavoriteApps(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.getFavoriteApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/add_app_to_favoris',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.addAppToFavoris)),

            function AppsController_addAppToFavoris(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"appIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.addAppToFavoris.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/remove_app_from_favoris',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AppsController)),
            ...(fetchMiddlewares<RequestHandler>(AppsController.prototype.removeAppFromFavoris)),

            function AppsController_removeAppFromFavoris(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"appIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AppsController();


              const promise = controller.removeAppFromFavoris.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/auth',
            authenticateMiddleware([{"all":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authenticate)),

            function AuthController_authenticate(request: any, response: any, next: any) {
            const args = {
                    credential: {"in":"body","name":"credential","required":true,"dataType":"union","subSchemas":[{"ref":"IUserCredential"},{"ref":"IAppCredential"},{"ref":"IOAuth2Credential"}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.authenticate.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/register_admin',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.registerToAdmin)),

            function AuthController_registerToAdmin(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"adminInfo":{"ref":"IAdmin","required":true},"pamInfo":{"ref":"IPamInfo","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.registerToAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_bos_to_auth_credential',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getBosToAdminCredential)),

            function AuthController_getBosToAdminCredential(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.getBosToAdminCredential.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_admin',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.deleteAdmin)),

            function AuthController_deleteAdmin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.deleteAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_admin_to_bos_credential',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getAdminCredential)),

            function AuthController_getAdminCredential(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.getAdminCredential.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/update_data',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.syncDataToAdmin)),

            function AuthController_syncDataToAdmin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.syncDataToAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/getTokenData',
            authenticateMiddleware([{"all":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.tokenIsValid)),

            function AuthController_tokenIsValid(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AuthController();


              const promise = controller.tokenIsValid.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/add_digitaltwin',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.addDigitalTwin)),

            function DigitaltwinController_addDigitalTwin(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}}},
                    set_as_actual_digitaltwin: {"in":"query","name":"set_as_actual_digitaltwin","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.addDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_all_digitaltwins',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.getAllDigitalTwins)),

            function DigitaltwinController_getAllDigitalTwins(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.getAllDigitalTwins.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_digitaltwin/:digitaltwinId',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.getDigitalTwin)),

            function DigitaltwinController_getDigitalTwin(request: any, response: any, next: any) {
            const args = {
                    digitaltwinId: {"in":"path","name":"digitaltwinId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.getDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/set_as_actual_digitaltwin/:digitaltwinId',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.setActualDigitalTwin)),

            function DigitaltwinController_setActualDigitalTwin(request: any, response: any, next: any) {
            const args = {
                    digitaltwinId: {"in":"path","name":"digitaltwinId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.setActualDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_actual_digitaltwin',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.getActualDigitalTwin)),

            function DigitaltwinController_getActualDigitalTwin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.getActualDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_digitaltwin_contexts',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.getDefaultDigitalTwinContexts)),

            function DigitaltwinController_getDefaultDigitalTwinContexts(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.getDefaultDigitalTwinContexts.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/get_digitaltwin_contexts/:digitaltwinId',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.getDigitalTwinContexts)),

            function DigitaltwinController_getDigitalTwinContexts(request: any, response: any, next: any) {
            const args = {
                    digitaltwinId: {"in":"path","name":"digitaltwinId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.getDigitalTwinContexts.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/update_digitaltwin/:digitaltwinId',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.editDigitalTwin)),

            function DigitaltwinController_editDigitalTwin(request: any, response: any, next: any) {
            const args = {
                    digitaltwinId: {"in":"path","name":"digitaltwinId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string"},"name":{"dataType":"string"}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.editDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_digitaltwin/:digitaltwinId',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.removeDigitalTwin)),

            function DigitaltwinController_removeDigitalTwin(request: any, response: any, next: any) {
            const args = {
                    digitaltwinId: {"in":"path","name":"digitaltwinId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.removeDigitalTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/delete_actual_digitaltwin',
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController)),
            ...(fetchMiddlewares<RequestHandler>(DigitaltwinController.prototype.removeActualDigitaTwin)),

            function DigitaltwinController_removeActualDigitaTwin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DigitaltwinController();


              const promise = controller.removeActualDigitaTwin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user_profile/create_profile',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.createUserProfile)),

            function UserProfileController_createUserProfile(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IProfile"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.createUserProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/get_profile/:id',
            authenticateMiddleware([{"profile":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.getUserProfile)),

            function UserProfileController_getUserProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.getUserProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/get_all_profile',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.getAllUserProfile)),

            function UserProfileController_getAllUserProfile(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.getAllUserProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/v1/user_profile/edit_profile/:id',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.updateUserProfile)),

            function UserProfileController_updateUserProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"ref":"IProfileAuthEdit"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.updateUserProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/user_profile/delete_profile/:id',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.deleteUserProfile)),

            function UserProfileController_deleteUserProfile(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.deleteUserProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/get_authorized_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.getAuthorizedContexts)),

            function UserProfileController_getAuthorizedContexts(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    digitalTwinId: {"in":"query","name":"digitalTwinId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.getAuthorizedContexts.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/get_authorized_apps/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.getAuthorizedApps)),

            function UserProfileController_getAuthorizedApps(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.getAuthorizedApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/get_authorized_admin_apps/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.getAuthorizedAdminApps)),

            function UserProfileController_getAuthorizedAdminApps(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.getAuthorizedAdminApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user_profile/authorize_profile_to_access_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.authorizeProfileToAccessContext)),

            function UserProfileController_authorizeProfileToAccessContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"digitalTwinId":{"dataType":"string"},"contextIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.authorizeProfileToAccessContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user_profile/authorize_profile_to_access_apps/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.authorizeProfileToAccessApps)),

            function UserProfileController_authorizeProfileToAccessApps(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"appIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.authorizeProfileToAccessApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user_profile/unauthorize_profile_to_access_contexts/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.unauthorizeProfileToAccessContext)),

            function UserProfileController_unauthorizeProfileToAccessContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"digitalTwinId":{"dataType":"string"},"contextIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.unauthorizeProfileToAccessContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user_profile/unauthorize_profile_to_access_apps/:profileId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.unauthorizeProfileToAccessApps)),

            function UserProfileController_unauthorizeProfileToAccessApps(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"appIds":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"array","array":{"dataType":"string"}}],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.unauthorizeProfileToAccessApps.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/profile_has_access_to_context/:profileId/:contextId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.profileHasAccessToContext)),

            function UserProfileController_profileHasAccessToContext(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    contextId: {"in":"path","name":"contextId","required":true,"dataType":"string"},
                    digitalTwinId: {"in":"query","name":"digitalTwinId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.profileHasAccessToContext.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user_profile/profile_has_access_to_app/:profileId/:appId',
            ...(fetchMiddlewares<RequestHandler>(UserProfileController)),
            ...(fetchMiddlewares<RequestHandler>(UserProfileController.prototype.profileHasAccessToApp)),

            function UserProfileController_profileHasAccessToApp(request: any, response: any, next: any) {
            const args = {
                    profileId: {"in":"path","name":"profileId","required":true,"dataType":"string"},
                    appId: {"in":"path","name":"appId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserProfileController();


              const promise = controller.profileHasAccessToApp.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
