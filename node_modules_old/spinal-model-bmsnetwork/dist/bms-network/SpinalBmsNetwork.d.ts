import { Model } from 'spinal-core-connectorjs_type';
/**
 *
 * @property {spinal.Str} name
 * @property {spinal.Str} type
 * @property {spinal.Str} id
 * @export
 * @class SpinalBmsNetwork
 * @extends {Model}
 */
export declare class SpinalBmsNetwork extends Model {
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsNetwork
     */
    static relationName: string;
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsNetwork
     */
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    /**
     *Creates an instance of SpinalBmsNetwork.
     * @param {string} [name='']
     * @param {string} [type='']
     * @param {string} [id=genUID('SpinalBmsNetwork')]
     * @memberof SpinalBmsNetwork
     */
    constructor(name?: string, type?: string, id?: string);
}
export default SpinalBmsNetwork;
