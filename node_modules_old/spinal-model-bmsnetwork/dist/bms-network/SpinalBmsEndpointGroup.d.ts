import { Model } from 'spinal-core-connectorjs_type';
/**
 * @property {spinal.Str} id;
 * @property {spinal.Str} name;
 * @property {spinal.Str} type;
 * @property {spinal.Str} path;
 * @export
 * @class SpinalBmsEndpointGroup
 * @extends {Model}
 */
export declare class SpinalBmsEndpointGroup extends Model {
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsEndpointGroup
     */
    static relationName: string;
    /**
     * @static
     * @type {string}
     * @memberof SpinalBmsEndpointGroup
     */
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    type: spinal.Str;
    path: spinal.Str;
    /**
     *Creates an instance of SpinalBmsEndpointGroup.
     * @param {string} [name='']
     * @param {string} [type='']
     * @param {string} [path='']
     * @param {string} [id=genUID('SpinalBmsNetwork')]
     * @memberof SpinalBmsEndpointGroup
     */
    constructor(name?: string, type?: string, path?: string, id?: string);
}
export default SpinalBmsEndpointGroup;
