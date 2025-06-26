/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApiRoute } from "../interfaces";
export declare class APIService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): APIService;
    init(): Promise<SpinalContext>;
    /**
     * Creates a new API route node in the context if it does not already exist.
     * If the route already exists, returns the existing node.
     * Also adds the new route to the admin profile.
     * @param routeInfo - Information about the API route to create.
     * @returns The created or existing SpinalNode.
     */
    createApiRoute(routeInfo: IApiRoute): Promise<SpinalNode>;
    /**
     * Updates the properties of an existing API route node with new values.
     *
     * @param routeId - The unique identifier of the API route to update.
     * @param newValue - An object containing the new values for the API route. The `id` and `type` properties are ignored.
     * @returns A promise that resolves to the updated `SpinalNode` representing the API route.
     * @throws Will throw an error if no API route is found for the given `routeId`.
     */
    updateApiRoute(routeId: string, newValue: IApiRoute): Promise<SpinalNode>;
    /**
     * Retrieves an API route node by its unique identifier.
     *
     * @param routeId - The unique identifier of the API route to retrieve.
     * @returns A promise that resolves to the matching `SpinalNode` if found, or `void` if no match is found.
     */
    getApiRouteById(routeId: string): Promise<void | SpinalNode>;
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
    getApiRouteByRoute(apiRoute: IApiRoute): Promise<void | SpinalNode>;
    /**
     * Retrieves all API route nodes within the current context.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` objects representing all API routes in the context.
     */
    getAllApiRoute(): Promise<SpinalNode[]>;
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
    deleteApiRoute(routeId: string): Promise<string>;
    /**
     * Uploads and processes a Swagger file buffer, extracting API routes and creating them asynchronously.
     *
     * @param buffer - The buffer containing the Swagger file data.
     * @returns A promise that resolves to an array of results from the created API routes.
     * @throws Will propagate errors from reading or formatting the Swagger file, but individual route creation errors are caught and ignored.
     */
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
}
