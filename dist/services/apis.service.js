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
exports.APIService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const adminProfile_service_1 = require("./adminProfile.service");
const apiUtils_1 = require("../utils/apiUtils");
class APIService {
    static instance;
    context;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new APIService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.API_ROUTES_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.API_ROUTES_CONTEXT_NAME, constant_1.API_ROUTES_CONTEXT_TYPE);
        return this.context;
    }
    /**
     * Creates a new API route node in the context if it does not already exist.
     * If the route already exists, returns the existing node.
     * Also adds the new route to the admin profile.
     * @param routeInfo - Information about the API route to create.
     * @returns The created or existing SpinalNode.
     */
    async createApiRoute(routeInfo) {
        const apiExist = await this.getApiRouteByRoute(routeInfo);
        if (apiExist) {
            console.log("api already exists");
            return apiExist;
        }
        const { id, ...routeInfoWithoutId } = routeInfo;
        const nodeInfo = Object.assign({}, routeInfoWithoutId, { type: constant_1.API_ROUTE_TYPE, name: routeInfo.route });
        const routeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(nodeInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(routeId);
        return this.context.addChildInContext(node, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context).then(async (result) => {
            await adminProfile_service_1.AdminProfileService.getInstance().addApiToProfil(node);
            return result;
        });
    }
    /**
     * Updates the properties of an existing API route node with new values.
     *
     * @param routeId - The unique identifier of the API route to update.
     * @param newValue - An object containing the new values for the API route. The `id` and `type` properties are ignored.
     * @returns A promise that resolves to the updated `SpinalNode` representing the API route.
     * @throws Will throw an error if no API route is found for the given `routeId`.
     */
    async updateApiRoute(routeId, newValue) {
        const { id, type, ...routeNewInfo } = newValue;
        const route = await this.getApiRouteById(routeId);
        if (!route)
            throw new Error(`no api route Found for ${routeId}`);
        for (const key in routeNewInfo) {
            if (Object.prototype.hasOwnProperty.call(routeNewInfo, key) && route.info[key]) {
                const element = routeNewInfo[key];
                route.info[key].set(element);
            }
        }
        return route;
    }
    /**
     * Retrieves an API route node by its unique identifier.
     *
     * @param routeId - The unique identifier of the API route to retrieve.
     * @returns A promise that resolves to the matching `SpinalNode` if found, or `void` if no match is found.
     */
    async getApiRouteById(routeId) {
        const children = await this.context.getChildrenInContext(this.context);
        return children.find((el) => el.getId().get() === routeId);
    }
    /**
     * Retrieves a child node from the context whose route and method match the provided `apiRoute`.
     *
     * This method searches through the children of the current context and attempts to find a node
     * whose route (after formatting) matches the given `apiRoute.route` (ignoring query parameters)
     * and whose HTTP method matches (case-insensitive). If a match is found, the corresponding
     * `SpinalNode` is returned; otherwise, `undefined` is returned.
     *
     * @param apiRoute - The API route object containing the route and HTTP method to match against.
     * @returns A promise that resolves to the matching `SpinalNode` if found, or `undefined` otherwise.
     */
    async getApiRouteByRoute(apiRoute) {
        const children = await this.context.getChildrenInContext(this.context);
        if (apiRoute.route.includes("?"))
            apiRoute.route = apiRoute.route.substring(0, apiRoute.route.indexOf("?"));
        return children.find((el) => {
            const { route, method } = el.info.get();
            if (route && method && method.toLowerCase() === apiRoute.method.toLowerCase()) {
                const routeFormatted = (0, apiUtils_1._formatRoute)(route);
                return apiRoute.route.match(routeFormatted);
            }
            return false;
        });
    }
    /**
     * Retrieves all API route nodes within the current context.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` objects representing all API routes in the context.
     */
    async getAllApiRoute() {
        return this.context.getChildrenInContext(this.context);
    }
    /**
     * Deletes an API route by its unique identifier.
     *
     * This method retrieves the API route corresponding to the provided `routeId`.
     * If the route exists, it removes the route from the graph and returns the `routeId`.
     * If the route does not exist, an error is thrown.
     *
     * @param routeId - The unique identifier of the API route to delete.
     * @returns A promise that resolves to the `routeId` of the deleted API route.
     * @throws {Error} If no API route is found for the given `routeId`.
     */
    async deleteApiRoute(routeId) {
        const route = await this.getApiRouteById(routeId);
        if (!route)
            throw new Error(`no api route Found for ${routeId}`);
        await route.removeFromGraph();
        return routeId;
    }
    /**
     * Uploads and processes a Swagger file buffer, extracting API routes and creating them asynchronously.
     *
     * @param buffer - The buffer containing the Swagger file data.
     * @returns A promise that resolves to an array of results from the created API routes.
     * @throws Will propagate errors from reading or formatting the Swagger file, but individual route creation errors are caught and ignored.
     */
    async uploadSwaggerFile(buffer) {
        const swaggerData = await (0, apiUtils_1._readBuffer)(buffer);
        const routes = await (0, apiUtils_1._formatSwaggerFile)(swaggerData);
        const promises = [];
        for (const route of routes) {
            promises.push(this.createApiRoute(route).catch((error) => { }));
        }
        return Promise.all(promises);
    }
}
exports.APIService = APIService;
//# sourceMappingURL=apis.service.js.map