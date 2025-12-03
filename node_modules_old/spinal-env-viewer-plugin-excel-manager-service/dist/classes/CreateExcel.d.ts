import * as Excel from "exceljs";
export default class CreateExcel {
    private workbook;
    private sheets;
    constructor(sheets: Array<{
        name: string;
        header: Array<{
            key: string | number;
            header: string;
        }>;
        rows: Array<{}>;
    }>, author?: string);
    createSheet(): void;
    addHeader(sheet: any, headers: Array<{
        key: string | number;
        header: string;
    }>): void;
    addRows(sheet: any, argRows: Array<{}> | Object): void;
    getWorkbook(): any;
    getWorkbookInstance(): Excel.Workbook;
}
