export declare type HTTP_METHOD = 'GET' | 'POST';
export declare function sendXhr(options: string | URL, command: string, httpMethod: 'POST', header?: {
    [key: string]: string;
}, body?: {
    [key: string]: string;
} | string): Promise<string>;
export declare function sendXhr(options: string | URL, command: string, httpMethod: 'GET', header?: {
    [key: string]: string;
}): Promise<string>;
