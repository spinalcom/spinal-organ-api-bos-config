import { IApiRoute, ISpinalApp } from '.';
export interface IProfileData {
    [key: string]: any;
    apps?: ISpinalApp[];
    apis?: IApiRoute[];
    contexts?: {
        [key: string]: any;
    };
}
