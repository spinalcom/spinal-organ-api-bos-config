import { Controller } from "tsoa";
export declare class DigitaltwinController extends Controller {
    constructor();
    addDigitalTwin(data: {
        name: string;
        url: string;
    }, set_as_actual_digitaltwin?: boolean): Promise<any>;
    getAllDigitalTwins(): Promise<any[] | {
        message: any;
    }>;
    getDigitalTwin(digitaltwinId: string): Promise<any>;
    setActualDigitalTwin(digitaltwinId: string): Promise<any>;
    getActualDigitalTwin(): Promise<any>;
    getDefaultDigitalTwinContexts(): Promise<any[] | {
        message: any;
    }>;
    getDigitalTwinContexts(digitaltwinId: string): Promise<any[] | {
        message: any;
    }>;
    editDigitalTwin(digitaltwinId: string, data: {
        name?: string;
        url?: string;
    }): Promise<any>;
    removeDigitalTwin(digitaltwinId: string): Promise<{
        message: any;
    }>;
    removeActualDigitaTwin(): Promise<{
        message: any;
    }>;
}
declare const _default: DigitaltwinController;
export default _default;
