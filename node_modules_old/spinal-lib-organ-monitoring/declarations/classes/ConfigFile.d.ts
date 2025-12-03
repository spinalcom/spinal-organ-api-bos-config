import { Model } from 'spinal-core-connectorjs';
import { ConfigFileModel } from '../models/ConfigFileModel';
export declare class ConfigFile {
    private static instance;
    private file;
    private constructor();
    static getInstance(): ConfigFile;
    init(connect: spinal.FileSystem, fileName: string, type: string, serverName: string, port: number): Promise<ConfigFileModel | undefined>;
    private _loadOrMakeConfigFile;
    private _createFile;
    private _scheduleReInit;
    private _reInitializeFileConfig;
    getConfig(): Promise<any> | undefined;
    setConfig(obj: Model): void;
    bindState(callback: (state: string) => void): void;
    setState(state: string): void;
    pushLog(message: string): void;
    pushLastAction(message: string): void;
}
export declare const configFile: ConfigFile;
export default configFile;
