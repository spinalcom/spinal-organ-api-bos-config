import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IProfile extends IProfileAuth {
    name: string;
}
export interface IProfileAuth {
    appsIds?: string[];
    subAppsIds?: string[];
    apisIds?: string[];
    contextIds?: string[];
}
export interface IProfileRes extends IProfileAuthRes {
    node: SpinalNode;
}
export interface IProfileAuthRes {
    contexts?: SpinalContext[];
    apps?: SpinalNode[];
    subApps?: SpinalNode[];
    apis?: SpinalNode[];
    adminApps?: SpinalNode[];
}
export interface IProfileAuthEdit extends IProfileAuth {
    name?: string;
    unauthorizeAppsIds?: string[];
    unauthorizeSubAppsIds?: string[];
    unauthorizeApisIds?: string[];
    unauthorizeContextIds?: string[];
}
