import { Obj } from './Obj';
/**
 * representation of a number
 * @export
 * @class Val
 * @extends {Obj<number>}
 */
export declare class Val extends Obj<number> {
    static _constructorName: string;
    /**
     * Creates an instance of Val.
     * @param {(number | Val)} [data=0]
     * @memberof Val
     */
    constructor(data?: number | Val);
    /**
     * toggle true / false ( 1 / 0 )
     * @return {*}  {boolean}
     * @memberof Val
     */
    toggle(): boolean;
    /**
     * @return {*}  {boolean}
     * @memberof Val
     */
    toBoolean(): boolean;
    /**
     * @return {*}  {Val}
     * @memberof Val
     */
    deep_copy(): Val;
    /**
     * @param {number} v
     * @memberof Val
     */
    add(v: number): void;
    /**
     * we do not take _set from Obj because we want a conversion if value is not a number
     * @protected
     * @param {(string | boolean | number | Val)} value
     * @return {*}  {boolean}
     * @memberof Val
     */
    protected _set(value: string | boolean | number | Val): boolean;
}
