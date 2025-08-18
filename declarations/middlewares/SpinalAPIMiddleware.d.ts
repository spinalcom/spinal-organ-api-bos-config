import { FileSystem, Model } from 'spinal-core-connectorjs';
import { SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IConfig, ISpinalAPIMiddleware } from 'spinal-organ-api-server';
export default class SpinalAPIMiddleware implements ISpinalAPIMiddleware {
    config: IConfig;
    conn: FileSystem;
    loadedPtr: Map<number, any>;
    iteratorGraph: AsyncGenerator<SpinalGraph<any>, never>;
    profilesToGraph: Map<string, SpinalGraph>;
    private static instance;
    graph: SpinalGraph<any>;
    private constructor();
    static getInstance(): SpinalAPIMiddleware;
    setConnection(conn: spinal.FileSystem): void;
    getGraph(): Promise<SpinalGraph<any>>;
    getProfileGraph(profileId: string): Promise<SpinalGraph>;
    addProfileToMap(profileId: string, graph: SpinalGraph): void;
    load<T extends Model>(server_id: number, profileId: string): Promise<T>;
    loadPtr<T extends Model>(ptr: spinal.File<T> | spinal.Ptr<T> | spinal.Pbr<T>): Promise<T>;
    private _geneGraph;
    setGraph(actualDigitalTwin?: SpinalNode): Promise<SpinalGraph<any>>;
    private _loadNewGraph;
    private _loadwithConnect;
    private _nodeIsBelongUserContext;
    private _getProfileContexts;
}
export { SpinalAPIMiddleware };
