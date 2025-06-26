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

import { API_ROUTES_CONTEXT_NAME, API_ROUTES_CONTEXT_TYPE, API_RELATION_NAME, API_ROUTE_TYPE, PTR_LST_TYPE } from "../constant";
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { IApiRoute, ISwaggerFile, ISwaggerPath, ISwaggerPathData } from "../interfaces";
import { AdminProfileService } from "./adminProfile.service";
import { _formatRoute, _formatSwaggerFile, _readBuffer } from "../utils/apiUtils";

export class APIService {
  private static instance: APIService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): APIService {
    if (!this.instance) this.instance = new APIService();

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(API_ROUTES_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(API_ROUTES_CONTEXT_NAME, API_ROUTES_CONTEXT_TYPE);
    return this.context;
  }

  /**
   * Creates a new API route node in the context if it does not already exist.
   * If the route already exists, returns the existing node.
   * Also adds the new route to the admin profile.
   * @param routeInfo - Information about the API route to create.
   * @returns The created or existing SpinalNode.
   */
  public async createApiRoute(routeInfo: IApiRoute): Promise<SpinalNode> {
    const apiExist = await this.getApiRouteByRoute(routeInfo);

    if (apiExist) {
      console.log("api already exists");
      return apiExist;
    }

    const { id, ...routeInfoWithoutId } = routeInfo;

    const nodeInfo = Object.assign({}, routeInfoWithoutId, { type: API_ROUTE_TYPE, name: routeInfo.route });

    const routeId = SpinalGraphService.createNode(nodeInfo, undefined);
    const node = SpinalGraphService.getRealNode(routeId);

    return this.context.addChildInContext(node, API_RELATION_NAME, PTR_LST_TYPE, this.context).then(async (result) => {
      await AdminProfileService.getInstance().addApiToProfil(node);
      return result;
    })
  }

  /**
   * Updates the properties of an existing API route node with new values.
   *
   * @param routeId - The unique identifier of the API route to update.
   * @param newValue - An object containing the new values for the API route. The `id` and `type` properties are ignored.
   * @returns A promise that resolves to the updated `SpinalNode` representing the API route.
   * @throws Will throw an error if no API route is found for the given `routeId`.
   */
  public async updateApiRoute(routeId: string, newValue: IApiRoute): Promise<SpinalNode> {
    const { id, type, ...routeNewInfo } = newValue;

    const route = await this.getApiRouteById(routeId);
    if (!route) throw new Error(`no api route Found for ${routeId}`);

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
  public async getApiRouteById(routeId: string): Promise<void | SpinalNode> {
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
  public async getApiRouteByRoute(apiRoute: IApiRoute): Promise<void | SpinalNode> {
    const children = await this.context.getChildrenInContext(this.context);
    if (apiRoute.route.includes("?")) apiRoute.route = apiRoute.route.substring(0, apiRoute.route.indexOf("?"));

    return children.find((el) => {
      const { route, method } = el.info.get();
      if (route && method && method.toLowerCase() === apiRoute.method.toLowerCase()) {
        const routeFormatted = _formatRoute(route);
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
  public async getAllApiRoute(): Promise<SpinalNode[]> {
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
  public async deleteApiRoute(routeId: string): Promise<string> {
    const route = await this.getApiRouteById(routeId);
    if (!route) throw new Error(`no api route Found for ${routeId}`);

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
  public async uploadSwaggerFile(buffer: Buffer): Promise<any[]> {
    const swaggerData = await _readBuffer(buffer);
    const routes = await _formatSwaggerFile(swaggerData);
    const promises = [];

    for (const route of routes) {
      promises.push(this.createApiRoute(route).catch((error) => { }));
    }

    return Promise.all(promises);

  }

}
