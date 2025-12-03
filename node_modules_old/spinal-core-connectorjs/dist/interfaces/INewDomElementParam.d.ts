export interface INewDomElementParam {
    nodeName?: string;
    parentNode?: HTMLElement;
    style?: {
        [key: string]: string | number;
    };
    onclick?: (evt: MouseEvent) => boolean;
    [key: string]: any;
}
