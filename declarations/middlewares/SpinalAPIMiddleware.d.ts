import { FileSystem, Model } from 'spinal-core-connectorjs';
import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IConfig, ISpinalAPIMiddleware } from 'spinal-organ-api-server';
export default class SpinalAPIMiddleware implements ISpinalAPIMiddleware {
    config: IConfig;
    conn: FileSystem;
    loadedPtr: Map<number, any>;
    iteratorGraph: AsyncGenerator<SpinalGraph<any>, never>;
    profilesToGraph: Map<string, SpinalGraph>;
    private static instance;
    private constructor();
    static getInstance(conn?: spinal.FileSystem): SpinalAPIMiddleware;
    getGraph(): Promise<SpinalGraph<any>>;
    getProfileGraph(profileId: string): Promise<SpinalGraph>;
    addProfileToMap(profileId: string, graph: SpinalGraph): void;
    load<T extends Model>(server_id: number, profileId: string): Promise<T>;
    loadPtr<T extends Model>(ptr: spinal.File<T> | spinal.Ptr<T> | spinal.Pbr<T>): Promise<T>;
    private _geneGraph;
    private _loadNewGraph;
    private _loadwithConnect;
    private _nodeIsBelongUserContext;
    private _getProfileContexts;
}
export { SpinalAPIMiddleware };
