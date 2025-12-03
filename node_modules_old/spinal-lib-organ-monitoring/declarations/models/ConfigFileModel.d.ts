import { Lst, Model, Ptr, Str, Val } from 'spinal-core-connectorjs';
export interface ILog extends Model {
    timeStamp: Val;
    message: Str;
}
export interface IGenericOrganData extends Model {
    id: Str;
    name: Str;
    type: Str;
    bootTimestamp: Val;
    lastHealthTime: Val;
    macAdress: Str;
    ramRssUsed: Str;
    serverName: Str;
    version: Str;
    logList: Lst<ILog>;
}
export interface ISpecificOrganData extends Model {
    port: Val;
    lastAction: {
        message: Str;
        date: Val;
    };
}
export declare class ConfigFileModel extends Model {
    genericOrganData: IGenericOrganData;
    specificOrganData: ISpecificOrganData;
    specificOrganConfig?: Ptr<any>;
    constructor(name?: string, type?: string, serverName?: string, port?: number);
    addToConfigFileModel(): Lst;
    updateIPandMacAdress(): void;
    updateRamUsage(): void;
    loadConfigModel(): Promise<any> | undefined;
    setConfigModel(model: Model): void;
}
