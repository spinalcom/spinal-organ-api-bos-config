import type { INewDomElementParam } from '../../interfaces/INewDomElementParam';
/**
 * create a new dom element
 * nodeName to specify kind (div by default)
 * parentNode to specify a parent
 * style { ... }
 * txt for a text node as a child
 * other paramers are used to set directly set attributes
 * @export
 * @param {INewDomElementParam} [params={}]
 * @param {string} [nodeName='div']
 * @return {*}  {HTMLElement}
 */
export declare function newDomElement(params?: INewDomElementParam, nodeName?: string): HTMLElement;
declare global {
    function new_dom_element(params?: INewDomElementParam, nodeName?: string): HTMLElement;
    function newDomElement(params?: INewDomElementParam, nodeName?: string): HTMLElement;
}
