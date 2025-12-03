import type { IFsData } from '../interfaces/IFsData';
import { Model } from './Model';
import { Obj } from './Obj';
/**
 * representation of a string
 * @export
 * @class Str
 * @extends {Obj<string>}
 */
export declare class Str extends Obj<string> {
    static _constructorName: string;
    _data: string;
    length: number;
    /**
     * Creates an instance of Str.
     * @param {(string | Str)} [data='']
     * @memberof Str
     */
    constructor(data?: string | Str);
    /**
     * toggle presence of str in this
     * @param {string} str
     * @param {string} [space=' ']
     * @return {*}  {boolean}
     * @memberof Str
     */
    toggle(str: string, space?: string): boolean;
    /**
     * true if str is contained in this
     * @param {string} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    contains(str: string): boolean;
    /**
     * @param {(string | Model)} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    equals(str: string | Model): boolean;
    /**
     * @return {*}  {string}
     * @memberof Str
     */
    toString(): string;
    /**
     * @param {string} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    ends_with(str: string): boolean;
    /**
     * @return {*}  {Str}
     * @memberof Str
     */
    deep_copy(): Str;
    /**
     * @param {IFsData} out
     * @memberof Str
     */
    _get_fs_data(out: IFsData): void;
    /**
     * @protected
     * @param {(Str | string)} [value='']
     * @return {*}  {boolean}
     * @memberof Str
     */
    protected _set(value?: Str | string): boolean;
    /**
     * @protected
     * @return {*}  {string}
     * @memberof Str
     */
    protected _get_state(): string;
    _set_state(str: string, _map: unknown): boolean;
}
