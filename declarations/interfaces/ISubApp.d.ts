export interface ISubApp {
    id?: string;
    type?: string;
    name: string;
    icon?: string;
    description?: string;
    tags?: string[];
    categoryName?: string;
    groupName?: string;
    hasViewer?: boolean;
    documentationLink?: string;
    appConfig?: any;
}
export interface ISubAppExel extends Partial<ISubApp> {
    name: string;
    /**
     * @type {string} can be appId or appName
     * @memberof ISubAppExel
     */
    parentApp: string;
    appConfig: any;
}
