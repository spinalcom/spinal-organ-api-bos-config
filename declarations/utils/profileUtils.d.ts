import { IProfileData, IProfileRes } from "../interfaces";
import { SpinalNode } from 'spinal-env-viewer-graph-service';
export declare function _formatProfile(data: IProfileRes): IProfileData;
export declare function _formatAuthRes(data: IProfileRes): {
    adminApps: any[];
    apps: any[];
    apis: any[];
    contexts: any[];
};
export declare function _getNodeListInfo(nodes?: SpinalNode[]): any[];
