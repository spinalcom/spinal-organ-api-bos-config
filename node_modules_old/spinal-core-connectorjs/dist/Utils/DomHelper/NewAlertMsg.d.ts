export interface INewAlertMsgParam {
    parent?: Element;
    title?: string;
    msg?: string;
    btn?: {
        txt: string;
        click: (evt?: MouseEvent) => boolean;
        backgroundColor: string;
    }[];
    onclose?: (evt?: MouseEvent) => boolean;
}
/**
 * make msg popup
 * @export
 * @class NewAlertMsg
 */
export declare class NewAlertMsg {
    private params;
    static _constructorName: string;
    private background;
    private footer;
    private popup;
    private img;
    private msg;
    constructor(params?: INewAlertMsgParam);
    hideBtn: () => void;
    hide_btn(): void;
    showBtn: () => void;
    show_btn(): void;
    hide(): void;
    show(): void;
    setMsg(msg: string): void;
    private createBackground;
    private createPopup;
    private createContent;
    private createFooter;
}
declare const NewAlertMsgType: typeof import("./NewAlertMsg").NewAlertMsg;
declare global {
    var NewAlertMsg: typeof NewAlertMsgType;
    var new_alert_msg: typeof NewAlertMsgType;
}
export {};
