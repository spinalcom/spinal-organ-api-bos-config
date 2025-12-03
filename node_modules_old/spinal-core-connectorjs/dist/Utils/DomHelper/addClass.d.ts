/**
 * obj is a DOM object. src is a string or an array of
 * string containing one or several classNames separated with spaces
 * @export
 * @param {HTMLElement} obj
 * @param {(string | string[])} src
 * @return {*}  {void}
 */
export declare function addClass(obj: HTMLElement, src: string | string[]): void;
declare global {
    function add_class(obj: HTMLElement, src: string | string[]): void;
    function addClass(obj: HTMLElement, src: string | string[]): void;
}
