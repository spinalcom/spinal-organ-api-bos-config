export default class ConvertExcel {
    private workbook;
    constructor(headerRow?: number);
    toJson(data: any, headerRow?: number): Promise<any>;
    private _getHeaders;
    private _getValueByColumnHeader;
    configurationToJson(data: any, headerRow: any): Promise<any>;
}
