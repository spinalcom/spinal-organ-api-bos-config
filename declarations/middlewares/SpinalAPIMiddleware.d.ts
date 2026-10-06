import { FileSystem, Model } from "spinal-core-connectorjs";
import { SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IConfig, ISpinalAPIMiddleware } from "spinal-organ-api-server";
export default class SpinalAPIMiddleware implements ISpinalAPIMiddleware {
    config: IConfig;
    conn: FileSystem | undefined;
    loadedPtr: Map<number, any>;
    iteratorGraph: AsyncGenerator<SpinalGraph<any>, never>;
    profilesToGraph: Map<string, SpinalGraph>;
    private static instance;
    graph: SpinalGraph | undefined;
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
    /**
     * Returns the model if the profile can access it :
     * - a node must belong to an authorized context (see _nodeIsBelongUserContext) ;
     * - a file (or document) must be linked to a node accessible to the profile (see _fileIsAccessible).
     * Any other model (Lst, Ptr, Path, FileVersion...) is refused.
     * A refused model rejects the returned promise with a { code, message } error.
     */
    private _checkModelAccess;
    private _toHttpError;
    private _nodeIsBelongUserContext;
    private _nodeBelongsToContexts;
    /**
     * Walks up the parents of a document node through the directories (DirectoryhasFiles, DirectoryhasDirectory)
     * up to the root directory and its owner (hasFiles).
     * A directory is authorized if it belongs to an authorized context ; an owner (room, equipment, ticket...)
     * is authorized with the same rule as any other node and is not walked through.
     */
    private _documentNodeIsLinkedToUserContext;
    /**
     * A file is accessible if the node it refers to (SpinalDocument or file converted by the documentation service)
     * is accessible. A file that can't be attached to any node (e.g. an old Drive file) is reserved to the admin profile.
     */
    private _fileIsAccessible;
    private _getFileNode;
    private _isAdminProfile;
    private _getProfileContexts;
}
export { SpinalAPIMiddleware };
