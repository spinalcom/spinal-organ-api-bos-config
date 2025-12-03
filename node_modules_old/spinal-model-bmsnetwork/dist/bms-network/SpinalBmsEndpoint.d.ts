import { Model } from "spinal-core-connectorjs_type";
/**
 * @property {spinal.Str} id
 * @property {spinal.Str} path
 * @property {spinal.Str | spinal.Val} currentValue
 * @property {spinal.Str} unit
 * @property {spinal.Str} type
 * @property {spinal.Str} dataType
 * @export
 * @class SpinalBmsEndpoint
 * @extends {Model}
 */
export declare class SpinalBmsEndpoint extends Model {
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsEndpoint
     */
    static relationName: string;
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsEndpoint
     */
    static nodeTypeName: string;
    id: spinal.Str;
    path: spinal.Str;
    currentValue: spinal.Str | spinal.Val;
    unit: spinal.Str;
    type: spinal.Str;
    dataType: spinal.Str;
    /**
     *Creates an instance of SpinalBmsEndpoint.
     * @param {string} [name='']
     * @param {string} [path='']
     * @param {(string|number)} [currentValue='']
     * @param {string} [unit='']
     * @param {string} [dataType='']
     * @param {string} [type='']
     * @param {string} [id=genUID('SpinalBmsEndpoint')]
     * @memberof SpinalBmsEndpoint
     */
    constructor(name?: string, path?: string, currentValue?: string | number | boolean, unit?: string, dataType?: string, type?: string, id?: string);
}
export default SpinalBmsEndpoint;
