import type { ISubApp } from "./ISubApp";
export interface ISpinalApp {
    name: string;
    icon: string;
    description: string;
    tags: string[];
    categoryName: string;
    groupName: string;
    hasViewer?: boolean;
    documentationLink?: string;
    packageName?: string;
    isExternalApp?: boolean;
    link?: string;
    subApps?: ISubApp[];
    [key: string]: any;
}
