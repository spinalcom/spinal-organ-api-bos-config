import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
export declare class DigitalTwinService {
    private static instance;
    private _actualDigitalTwin;
    private attrName;
    context: SpinalContext;
    private constructor();
    static getInstance(): DigitalTwinService;
    init(): Promise<SpinalContext>;
    /**
     * Retrieves the graph element associated with the provided digital twin node.
     *
     * @param digitalTwin - The SpinalNode instance representing the digital twin.
     * @returns A promise that resolves to the corresponding SpinalGraph.
     * @throws Will throw an error if the retrieval fails.
     */
    getDigitalTwinGraph(digitalTwin: SpinalNode): Promise<SpinalGraph>;
    /**
     * Retrieves the list of contexts associated with a digital twin.
     *
     * If a `digitalTwinId` is provided, it fetches the contexts for the specified digital twin.
     * Otherwise, it fetches the contexts for the currently active digital twin.
     * Returns an empty array if the digital twin or its graph cannot be found.
     *
     * @param digitalTwinId - (Optional) The ID of the digital twin to retrieve contexts for.
     * @returns A promise that resolves to an array of `SpinalContext` objects associated with the digital twin.
     */
    getDigitalTwinContexts(digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Finds and returns a specific context within a digital twin by its context ID.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to search within.
     * @param contextId - The unique identifier of the context to find.
     * @returns A promise that resolves to the found `SpinalContext` if it exists, or `undefined` if not found.
     */
    findContextInDigitalTwin(digitalTwinId: string, contextId: string): Promise<SpinalContext>;
    /**
     * Creates a new digital twin node and its associated graph file.
     *
     * If the graph file already exists at the specified directory path, it will use the existing graph.
     * Otherwise, it creates a new graph file and node. Optionally sets the created node as the default digital twin.
     *
     * @param name - The name of the digital twin.
     * @param directoryPath - The directory path where the digital twin graph file should be stored.
     * @param setAsDefault - (Optional) Whether to set the created digital twin as the default. Defaults to false.
     * @returns A promise that resolves to the created `SpinalNode` instance.
     */
    createDigitalTwin(name: string, directoryPath: string, setAsDefault?: boolean): Promise<SpinalNode>;
    /**
     * Retrieves all digital twin nodes from the current context.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing all digital twins.
     *
     * @throws Will propagate any errors thrown by the underlying context's `getChildren` method.
     */
    getAllDigitalTwins(): Promise<SpinalNode[]>;
    /**
     * Retrieves a specific digital twin node by its unique identifier.
     *
     * @param digitaltwinId - The unique identifier of the digital twin to retrieve.
     * @returns A promise that resolves to the matching `SpinalNode` if found, or `void` if not found.
     */
    getDigitalTwin(digitaltwinId: string): Promise<SpinalNode | void>;
    /**
     * Updates the properties of a digital twin node with new data.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to edit.
     * @param newData - An object containing the properties to update. Supported keys are `name` and `url`.
     * @returns A promise that resolves to the updated `SpinalNode` if found, otherwise `undefined`.
     *
     * @throws Will throw an error if the digital twin cannot be retrieved.
     */
    editDigitalTwin(digitalTwinId: string, newData: {
        name?: string;
        url?: string;
    }): Promise<SpinalNode>;
    /**
     * Removes a digital twin from the graph by its ID.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to remove.
     * @returns A promise that resolves to `true` if the digital twin was found and removed, or `false` if not found.
     */
    removeDigitalTwin(digitalTwinId: string): Promise<boolean>;
    /**
     * Sets the specified digital twin as the actual (default) digital twin.
     *
     * Updates the context and the digital twin node to reflect the new default.
     * Removes the previous default digital twin if it exists.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to set as actual.
     * @returns A promise that resolves to the set `SpinalNode` if successful, or `undefined` if not found.
     */
    setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void>;
    /**
     * Retrieves the current digital twin node associated with the context.
     *
     * If the digital twin node is already loaded and cached, it resolves immediately with the cached node.
     * If the node does not exist and `createIfNotExist` is `true`, it creates a new digital twin node and resolves with it.
     * If the node does not exist and `createIfNotExist` is `false`, it resolves with `undefined`.
     * Otherwise, it loads the node asynchronously and resolves with the loaded node.
     *
     * @param createIfNotExist - Whether to create the digital twin node if it does not exist. Defaults to `false`.
     * @returns A promise that resolves with the `SpinalNode` representing the digital twin, or `undefined` if not found and not created.
     */
    getActualDigitalTwin(createIfNotExist?: boolean): Promise<SpinalNode>;
    /**
     * Removes the current actual (default) digital twin association from the context.
     *
     * This method clears the reference to the default digital twin in both the context and the digital twin node itself.
     *
     * @returns A promise that resolves to `true` if the association was removed, or `false` if no default was set.
     */
    removeActualDigitaTwin(): Promise<boolean>;
    private _getOrCreateDigitalTwin;
    private _createFile;
    private _createDigitalTwinNode;
}
