import { IApiRoute, IApp } from ".";
export interface IProfileData {
    [key: string]: any;
    apps?: IApp[];
    apis?: IApiRoute[];
    contexts?: {
        [key: string]: any;
    };
}
