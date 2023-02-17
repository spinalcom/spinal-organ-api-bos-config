import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IProfile extends IProfileAuth {
    name: string;
}
export interface IProfileAuth {
    appsIds?: string[];
    apisIds?: string[];
    contextIds?: string[];
}
export interface IProfileRes extends IProfileAuthRes {
    node: SpinalNode;
}
export interface IProfileAuthRes {
    contexts?: SpinalContext[];
    apps?: SpinalNode[];
    apis?: SpinalNode[];
    adminApps?: SpinalNode[];
}
export interface IProfileAuthEdit extends IProfileAuth {
    name?: string;
    unauthorizeAppsIds?: string[];
    unauthorizeApisIds?: string[];
    unauthorizeContextIds?: string[];
}
