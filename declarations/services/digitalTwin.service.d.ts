import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
export declare class DigitalTwinService {
    private static instance;
    private _actualDigitalTwin;
    private attrName;
    context: SpinalContext;
    private constructor();
    static getInstance(): DigitalTwinService;
    init(): Promise<SpinalContext>;
    getDigitalTwinGraph(digitalTwin: SpinalNode): Promise<SpinalGraph>;
    getDigitalTwinContexts(digitalTwinId?: string): Promise<SpinalContext[]>;
    findContextInDigitalTwin(digitalTwinId: string, contextId: string): Promise<SpinalContext>;
    createDigitalTwin(name: string, directoryPath: string, setAsDefault?: boolean): Promise<SpinalNode>;
    getAllDigitalTwins(): Promise<SpinalNode[]>;
    getDigitalTwin(digitaltwinId: string): Promise<SpinalNode | void>;
    editDigitalTwin(digitalTwinId: string, newData: {
        name?: string;
        url?: string;
    }): Promise<SpinalNode>;
    removeDigitalTwin(digitalTwinId: string): Promise<boolean>;
    setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void>;
    getActualDigitalTwin(createIfNotExist?: boolean): Promise<SpinalNode>;
    removeActualDigitaTwin(): Promise<boolean>;
    private _getOrCreateDigitalTwin;
    private _createFile;
    private _createDigitalTwinNode;
}
