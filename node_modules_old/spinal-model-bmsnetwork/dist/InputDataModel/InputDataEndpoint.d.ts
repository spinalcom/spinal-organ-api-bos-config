import { InputDataEndpointDataType } from "./InputDataEndpointDataType";
import { InputDataEndpointType } from "./InputDataEndpointType";
/**
 * @property {string} id
 * @property {string} name
 * @property {string} path
 * @property {number|string} currentValue;
 * @property {string} unit
 * @property {InputDataEndpointDataType} dataType
 * @property {InputDataEndpointType} type
 * @property {string} nodeTypeName should be SpinalBmsEndpoint.nodeTypeName || 'BmsEndpoint'
 * @export
 * @class InputDataEndpoint
 */
export interface InputDataEndpoint {
    id: string;
    name: string;
    path: string;
    currentValue: number | string | boolean;
    unit: string;
    dataType: InputDataEndpointDataType;
    type: InputDataEndpointType;
    nodeTypeName: string;
}
