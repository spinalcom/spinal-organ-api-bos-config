import { InputDataEndpoint } from './InputDataEndpoint';
import { InputDataEndpointGroup } from './InputDataEndpointGroup';
/**
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} path
 * @property {(InputDataEndpoint | InputDataEndpointGroup | InputDataDevice)[]} children
 * @property {string} nodeTypeName = SpinalBmsDevice.nodeTypeName || 'BmsDevice'
 * @export
 * @interface InputDataDevice
 */
export interface InputDataDevice {
    id: string;
    name: string;
    type: string;
    path: string;
    children: (InputDataEndpoint | InputDataEndpointGroup | InputDataDevice)[];
    nodeTypeName: string;
}
