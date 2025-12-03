import { InputDataEndpoint } from './InputDataEndpoint';
/**
 * @export
 * @interface InputDataEndpointGroup
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} path
 * @property {InputDataEndpoint[]} children
 * @property {string} nodeTypeName = SpinalBmsEndpointGroup.nodeTypeName || 'BmsEndpointGroup'
 */
export interface InputDataEndpointGroup {
    id: string;
    name: string;
    type: string;
    path: string;
    children: (InputDataEndpoint)[];
    nodeTypeName: string;
}
