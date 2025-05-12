import { IProfileData, IProfileRes } from '../interfaces';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
export declare function _formatProfile(data: IProfileRes): Promise<IProfileData>;
export declare function _formatAuthRes(data: IProfileRes): Promise<{
    adminApps: any[];
    apps: import("../interfaces").ISpinalApp[];
    apis: any[];
    contexts: any[];
}>;
export declare function _getNodeListInfo(nodes?: SpinalNode[]): any[];
