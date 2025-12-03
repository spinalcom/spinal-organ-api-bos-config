import type { IFsData } from '../interfaces/IFsData';
import { Model } from './Model';
export declare abstract class TypedArray<T extends Int32Array | Float64Array> extends Model {
    static _constructorName: string;
    _size: number[];
    _data: T;
    /**
     * Creates an instance of TypedArray.
     * @param {(number | number[])} [size]
     * @param {T} [data]
     * @memberof TypedArray
     */
    protected constructor(size?: number | number[], data?: T);
    /**
     * @abstract
     * @return {*}  {*}
     * @memberof TypedArray
     */
    abstract base_type(): any;
    /**
     * @return {*}  {number}
     * @memberof TypedArray
     */
    dim(): number;
    /**
     * @param {number} [d]
     * @return {*}  {(number | number[])}
     * @memberof TypedArray
     */
    size(d?: number): number | number[];
    /**
     * @param {(number[] | number)} index
     * @param {*} value
     * @memberof TypedArray
     */
    set_val(index: number[] | number, value: any): void;
    /**
     * @return {*}  {number}
     * @memberof TypedArray
     */
    nb_items(): number;
    /**
     * @return {*}  {string}
     * @memberof TypedArray
     */
    toString(): string;
    /**
     * @param {(TypedArray<any> | any)} obj
     * @return {*}  {boolean}
     * @memberof TypedArray
     */
    equals(obj: TypedArray<any> | any): boolean;
    /**
     * @param {number} [index]
     * @return {*}  {(number | T)}
     * @memberof TypedArray
     */
    get(index?: number): number | T;
    /**
     * @param {number[]} new_size
     * @memberof TypedArray
     */
    resize(new_size: number[]): void;
    /**
     * @protected
     * @param {*} str
     * @return {*}  {boolean}
     * @memberof TypedArray
     */
    protected _set(str: any): boolean;
    /**
     * @private
     * @param {(number[] | number)} index
     * @return {*}  {number}
     * @memberof TypedArray
     */
    private _get_index;
    /**
     * @param {IFsData} out
     * @memberof TypedArray
     */
    _get_fs_data(out: IFsData): void;
    /**
     * @protected
     * @return {*}  {string}
     * @memberof TypedArray
     */
    protected _get_state(): string;
    /**
     * @param {string} str
     * @memberof TypedArray
     */
    _set_state(str: string): void;
}
