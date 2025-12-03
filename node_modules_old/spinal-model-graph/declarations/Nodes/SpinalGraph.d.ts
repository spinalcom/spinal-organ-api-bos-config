import { Model } from 'spinal-core-connectorjs';
import { SpinalContext } from './SpinalContext';
import { SpinalNode } from './SpinalNode';
/**
 * Starting node of a graph.
 * @extends SpinalNode
 */
declare class SpinalGraph<T extends Model = any> extends SpinalNode<T> {
    /**
     * Constructor for the SpinalGraph class.
     * @param {String} [name="undefined"] Name of the graph, usually unused
     * @param {String} [type="SpinalGraph"] Type of the graph, usually unused
     * @param {SpinalNode | Model} [element] Element of the graph
     * @throws {TypeError} If the element is not a Model
     */
    constructor(name?: string, type?: string, element?: T);
    /**
     * Adds a context to the graph.
     * @param {SpinalContext} context Context to be added
     * @returns {Promise<SpinalContext>} The added context
     * @throws {TypeError} If the context is not a context
     */
    addContext<K extends Model>(context: SpinalContext<K>): Promise<SpinalContext<K>>;
    /**
     * Searches for a context using its name.
     * @param {String} name Name of the context
     * @returns {SpinalContext | undefined} The wanted context or undefined
     * @throws {TypeError} If name is not a string
     */
    getContext(name: any): Promise<SpinalNode<any>>;
    /**
     * Empty override of the SpinalNode method.
     * @override
     * @returns {Promise<nothing>} An empty promise
     */
    removeFromGraph(): Promise<void>;
}
export default SpinalGraph;
export { SpinalGraph };
