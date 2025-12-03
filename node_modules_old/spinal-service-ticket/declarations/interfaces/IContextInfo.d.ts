export interface IStepInfo {
    name: string;
    order: number;
    color?: string;
}
export interface IContextInfo {
    name: string;
    id?: string;
    type?: string;
    steps?: IStepInfo[];
}
