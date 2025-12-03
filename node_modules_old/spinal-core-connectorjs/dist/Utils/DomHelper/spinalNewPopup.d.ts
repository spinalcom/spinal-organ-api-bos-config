/**
 * @export
 * @interface ISpinalNewPopupParam
 */
export interface ISpinalNewPopupParam {
    popup_closer?: true;
    onclose?: () => void;
    fixed_opacity?: string | number;
    event?: MouseEvent;
    top_x?: number;
    top_y?: number;
    width?: string;
    height?: string;
    child?: HTMLElement;
}
/**
 * make a popup window.
 * returns the creted "inside" div
 * clicking outside closes the window.
 * drag title permits to move he window
 * @export
 * @param {string} title
 * @param {ISpinalNewPopupParam} [params={}]
 * @return {*}  {HTMLElement}
 */
export declare function spinalNewPopup(title: string, params?: ISpinalNewPopupParam): HTMLElement;
declare global {
    function spinalNewPopup(title: string, params?: ISpinalNewPopupParam): HTMLElement;
    function spinal_new_popup(title: string, params?: ISpinalNewPopupParam): HTMLElement;
}
