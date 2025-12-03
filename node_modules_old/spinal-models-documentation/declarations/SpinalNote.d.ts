import { Model } from 'spinal-core-connectorjs_type';
export interface ViewStateInterface {
    viewState: string;
    objectState: string;
    [key: string]: any;
}
export interface ViewStateInterfaceModel extends spinal.Model {
    viewState: spinal.Str;
    objectState: spinal.Str;
    [key: string]: any;
}
export declare class SpinalNote extends Model {
    username: spinal.Str;
    date: spinal.Str;
    message: spinal.Str;
    userId: spinal.Str;
    type: spinal.Str;
    file: spinal.Ptr<spinal.File<spinal.Path>>;
    viewPoint: ViewStateInterfaceModel;
    constructor(username: string, message: string, userId: string, type?: string, file?: any, viewPoint?: ViewStateInterface);
}
