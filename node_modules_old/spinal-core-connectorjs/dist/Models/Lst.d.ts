import type { IFlatModelMap } from '../interfaces/IFlatModelMap';
import type { IFsData } from '../interfaces/IFsData';
import type { IStateMap } from '../interfaces/IStateMap';
import type { SpinalFilterFunction } from '../interfaces/SpinalFilterFunction';
import type { SpinalSortFunction } from '../interfaces/SpinalSortFunction';
import { Model } from './Model';
/**
 * Bese representation of an Array
 * @export
 * @class Lst
 * @extends {Model}
 * @template T
 */
export declare class Lst<T extends Model = any> extends Model {
    /**
     * @static
     * @type {string}
     * @memberof Lst
     */
    static _constructorName: string;
    /**
     * @type {number}
     * @memberof Lst
     */
    length: number;
    /**
     * Creates an instance of Lst.
     * @param {*} [data]
     * @memberof Lst
     */
    constructor(data?: any);
    /**
     * @return {*}  {number}
     * @memberof Lst
     */
    static_length(): number;
    /**
     * @protected
     * @return {*}  {number}
     * @memberof Lst
     */
    protected default_value(): number;
    /**
     * @protected
     * @return {*}  {*}
     * @memberof Lst
     */
    protected base_type(): any;
    /**
     * @return {*}  {ReturnType<T['get']>[]}
     * @memberof Lst
     */
    get(): ReturnType<T['get']>[];
    /**
     * @return {*}  {[number]}
     * @memberof Lst
     */
    size(): [number];
    /**
     * @return {*}  {string}
     * @memberof Lst
     */
    toString(): string;
    /**
     * @param {Lst<T>} lst
     * @return {*}  {boolean}
     * @memberof Lst
     */
    equals(lst: Lst<T>): boolean;
    /**
     * @param {*} value
     * @param {boolean} [force=false]
     * @return {*}  {void}
     * @memberof Lst
     */
    push(value: any, force?: boolean): void;
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    pop(): T;
    /**
     * @memberof Lst
     */
    clear(): void;
    /**
     * @param {*} value
     * @return {*}  {number}
     * @memberof Lst
     */
    unshift(value: any): number;
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    shift(): T;
    /**
     * @param {T} item
     * @memberof Lst
     */
    remove(item: T | ReturnType<T['get']>): void;
    /**
     * @param {T} item
     * @memberof Lst
     */
    remove_ref(item: T | ReturnType<T['get']>): void;
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {T[]}
     * @memberof Lst
     */
    filter(f: SpinalFilterFunction<T>): T[];
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {T}
     * @memberof Lst
     */
    detect(f: SpinalFilterFunction<T>): T;
    /**
     * @param {SpinalSortFunction<T>} sort
     * @return {*}  {Array<T>}
     * @memberof Lst
     */
    sorted(sort: SpinalSortFunction<T>): Array<T>;
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {boolean}
     * @memberof Lst
     */
    has(f: SpinalFilterFunction<T>): boolean;
    /**
     * @param {T} value
     * @return {*}  {(number | -1)} -1 if not found
     * @memberof Lst
     */
    indexOf(value: T | ReturnType<T['get']>): number | -1;
    /**
     * @param {T} value
     * @return {*}  {number}
     * @memberof Lst
     */
    indexOf_ref(value: T | ReturnType<T['get']>): number;
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    contains(value: T | ReturnType<T['get']>): boolean;
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    contains_ref(value: T | ReturnType<T['get']>): boolean;
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    toggle(value: T | ReturnType<T['get']>): boolean;
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    toggle_ref(value: T | ReturnType<T['get']>): boolean;
    /**
     * @param {number} begin
     * @param {number} [end=this.length]
     * @return {*}  {Lst<T>}
     * @memberof Lst
     */
    slice(begin: number, end?: number): Lst<T>;
    /**
     * @param {Lst<T>} new_tab
     * @param {boolean} [force=false]
     * @return {*}  {void}
     * @memberof Lst
     */
    concat(new_tab: any, force?: boolean): void;
    /**
     * @param {number} index
     * @param {number} [n=1]
     * @return {*}  {void}
     * @memberof Lst
     */
    splice(index: number, n?: number): void;
    /**
     * @param {number} index
     * @param {(Lst<T> | T[] | Lst<any> | any[])} lst
     * @memberof Lst
     */
    insert(index: number, lst: Lst<T> | T[] | ReturnType<T['get']>[]): void;
    /**
     * @param {number} index
     * @param {T} val
     * @return {*}  {void}
     * @memberof Lst
     */
    set_or_push(index: number, val: T | ReturnType<T['get']>): void;
    /**
     * @param {number} size
     * @memberof Lst
     */
    trim(size: number): void;
    /**
     * @param {string} sep
     * @return {*}  {string}
     * @memberof Lst
     */
    join(sep: string): string;
    /**
     * @return {*}  {Lst<T>}
     * @memberof Lst
     */
    deep_copy(): Lst<T>;
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    back(): T;
    /**
     * @return {*}  {boolean}
     * @memberof Lst
     */
    real_change(): boolean;
    /**
     * @protected
     * @param {Lst<T>} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    protected _set(value: Lst<T> | ReturnType<T['get']>[] | T[]): boolean;
    /**
     * @protected
     * @param {IFlatModelMap} map
     * @param {number} date
     * @return {*}  {IFlatModelMap}
     * @memberof Lst
     */
    protected _get_flat_model_map(map: IFlatModelMap, date: number): IFlatModelMap;
    /**
     * @param {IFsData} out
     * @memberof Lst
     */
    _get_fs_data(out: IFsData): void;
    /**
     * @protected
     * @return {*}  {string}
     * @memberof Lst
     */
    protected _get_state(): string;
    /**
     * @param {string} str
     * @param {IStateMap<T>} map
     * @memberof Lst
     */
    _set_state(str: string, map: IStateMap<T>): void;
    /**
     * @param {boolean} force
     * @return {*}  {boolean}
     * @memberof Lst
     */
    _static_size_check(force: boolean): boolean;
    /**
     * @return {*}  {Generator<T, void, unknown>}
     * @memberof Lst
     */
    [Symbol.iterator](): Generator<T, void, unknown>;
}
declare type LstAlias<T extends Model = any> = Lst<T>;
declare global {
    export namespace spinal {
        type Lst<T extends Model = any> = LstAlias<T>;
    }
}
export {};
