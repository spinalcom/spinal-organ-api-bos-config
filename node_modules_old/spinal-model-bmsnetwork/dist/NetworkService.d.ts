import { SpinalNode, SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import { SpinalDateValue, SpinalDateValueArray, SpinalServiceTimeseries, SpinalTimeSeries, SpinalTimeSeriesArchive, SpinalTimeSeriesArchiveDay } from 'spinal-model-timeseries';
import { InputDataDevice, InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointGroup, InputDataEndpointType } from './InputDataModel/InputDataModel';
import { SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup, SpinalBmsNetwork } from './SpinalBms';
import { ConfigService } from './Utils/ConfigService';
/**
 * @export
 * @class NetworkService
 */
export declare class NetworkService {
    private context;
    private contextId;
    private networkId;
    private spinalServiceTimeseries;
    useDelay: number;
    useTimeseries: boolean;
    /**
     *Creates an instance of NetworkService.
     * @memberof NetworkService
     */
    constructor(useTimeseries?: boolean);
    setupDelay(timeout: number): void;
    /**
     * @param {spinal.Model} forgeFile
     * @param {ConfigService} configService
     * @param {boolean} [autoCreate=true]
     * @returns {Promise<{contextId:string, networkId: string}>}
     * @memberof NetworkService
     */
    init(forgeFile: spinal.Model, configService: ConfigService, autoCreate?: boolean): Promise<{
        contextId: string;
        networkId: string;
    }>;
    /**
     * @param {string} parentId
     * @param {string} typeName
     * @param {string} networkName
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsNetwork(parentId: string, typeName: string, networkName: string): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataDevice} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsDevice(parentId: string, obj: InputDataDevice): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataEndpointGroup} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpointGroup(parentId: string, obj: InputDataEndpointGroup): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataEndpoint} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpoint(parentId: string, obj: InputDataEndpoint): Promise<any>;
    createNewBmsEndpointWithoutContext(parentId: string, obj: InputDataEndpoint): Promise<SpinalNodeRef>;
    /**
     * @param {InputDataDevice} obj
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateData(obj: InputDataDevice, date?: any): Promise<void>;
    /**
     * @private
     * @param {*} node
     * @param {(InputDataDevice|InputDataEndpointGroup)} reference
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    private updateModel;
    /**
     * @param {*} node
     * @param {InputDataEndpoint} reference
     * @param {*} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateEndpoint(node: any, reference: InputDataEndpoint, date?: any): Promise<void>;
    /**
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getNetworks(): Promise<string[]>;
    /**
     * @private
     * @param {string} idElement
     * @param {string[]} relationNames
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    private find;
    /**
     * @param {string} idDevice
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getEndpoint(idDevice: string): Promise<string[]>;
    getDevices(idNetwork: string): Promise<string[]>;
    /**
     * @param {string} idNode
     * @returns {spinal.Model}
     * @memberof NetworkService
     */
    getInfo(idNode: string): spinal.Model;
    /**
     * @param {string} idNode
     * @returns {Promise<spinal.Model>}
     * @memberof NetworkService
     */
    getData(idNode: string): Promise<spinal.Model>;
    /**
     * @param {string} idEndpoint
     * @returns {Promise<SpinalTimeSeries>}
     * @memberof NetworkService
     */
    getTimeseries(idEndpoint: string): Promise<SpinalTimeSeries>;
    getTimeseriesProm(endpoint: SpinalNode): Promise<SpinalNode>;
    /**
     * @param {string} idEndpoint
     * @param {(string|boolean|number)} value
     * @param {(number|string|Date)} [date=null]
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    setEndpointValue(idEndpoint: string, value: string | boolean | number, date?: number | string | Date): Promise<any>;
    linkControlEndpointToEndPoint(controlEndPoint: SpinalNode, endPoint: SpinalNode): Promise<void>;
    private _createAttributes;
}
export default NetworkService;
export { ConfigService };
export { InputDataDevice, InputDataEndpoint, InputDataEndpointGroup, InputDataEndpointType, InputDataEndpointDataType, };
export { SpinalBmsDevice, SpinalBmsNetwork, SpinalBmsEndpoint, SpinalBmsEndpointGroup, };
export { SpinalServiceTimeseries, SpinalTimeSeries, SpinalTimeSeriesArchive, SpinalTimeSeriesArchiveDay, SpinalDateValue, SpinalDateValueArray, };
