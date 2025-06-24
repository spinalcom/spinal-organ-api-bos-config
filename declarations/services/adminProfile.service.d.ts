import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
export declare class AdminProfileService {
    private static instance;
    private _adminNode;
    private constructor();
    static getInstance(): AdminProfileService;
    get adminNode(): SpinalNode<any>;
    init(context: SpinalContext): Promise<SpinalNode>;
    getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode>;
    addAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    addSubAppToProfil(app: SpinalNode, subApp: SpinalNode): Promise<SpinalNode[]>;
    addAdminAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    addApiToProfil(apis: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    addDigitalTwinToAdminProfile(digitalTwins: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    syncAdminProfile(): Promise<any>;
    private _createAdminProfile;
    private _authorizeAllDigitalTwin;
    private _authorizeAllApps;
    private _authorizeAllAdminApps;
    private _authorizeAllApis;
}
