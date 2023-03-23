import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
export default class AuthorizationService {
    private static instance;
    private constructor();
    static getInstance(): AuthorizationService;
    authorizeProfileToAccessContext(profile: SpinalNode, digitalTwinId: string, contextIds: string | string[]): Promise<SpinalContext[]>;
    authorizeProfileToAccessApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]>;
    authorizeProfileToAccessAdminApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]>;
    authorizeProfileToAccessApis(profile: SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedContexts(profile: SpinalNode, digitalTwinId: string): Promise<SpinalContext[]>;
    getAuthorizedApps(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedAdminApps(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedApis(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedDigitalTwinNode(profile: SpinalNode, digitalTwinId: string, createIfNotExist?: boolean): Promise<SpinalNode<any>>;
    unauthorizeProfileToAccessContext(profile: SpinalNode, digitalTwinId: string, contextIds: string | string[]): Promise<SpinalContext[]>;
    unauthorizeProfileToAccessApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessApis(profile: SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]>;
    profileHasAccessToContext(profile: SpinalNode, digitalTwinId: string, contextId: string): Promise<SpinalNode>;
    profileHasAccessToApp(profile: SpinalNode, appId: string): Promise<SpinalNode>;
    profileHasAccessToApi(profile: SpinalNode, apiId: string): Promise<SpinalNode>;
    private _createNodeReference;
    private _addRefToNode;
    private _getRealNode;
    private _getActualDigitalTwinId;
}
declare const authorizationInstance: AuthorizationService;
export { authorizationInstance, AuthorizationService };
