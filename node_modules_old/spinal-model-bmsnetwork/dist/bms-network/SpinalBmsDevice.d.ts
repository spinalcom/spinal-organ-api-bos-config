import { Model } from 'spinal-core-connectorjs_type';
/**
 * @property {spinal.Str} id;
 * @property {spinal.Str} name;
 * @property {spinal.Str} type;
 * @property {spinal.Str} path;
 * @export
 * @class SpinalBmsDevice
 * @extends {Model}
 */
export declare class SpinalBmsDevice extends Model {
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsDevice
     */
    static relationName: string;
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsDevice
     */
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    type: spinal.Str;
    path: spinal.Str;
    /**
     *Creates an instance of SpinalBmsDevice.
     * @param {string} [name='']
     * @param {string} [type='']
     * @param {string} [path='']
     * @param {string} [id=genUID('SpinalBmsDevice')]
     * @memberof SpinalBmsDevice
     */
    constructor(name?: string, type?: string, path?: string, id?: string);
}
export default SpinalBmsDevice;
