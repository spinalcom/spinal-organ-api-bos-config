import type { Model } from '../../Models/Model';
import { Ptr } from './Ptr';
/**
 * @export
 * @class Pbr
 * @extends {Ptr<T>}
 * @template T
 */
export declare class Pbr<T extends Model = any> extends Ptr<T> {
    /**
     * @static
     * @type {string}
     * @memberof Pbr
     */
    static _constructorName: string;
    /**
     * Creates an instance of Pbr.
     * @param {*} [model]
     * @memberof Pbr
     */
    constructor(model?: any);
}
declare type _Pbr<T extends Model = any> = Pbr<T>;
declare global {
    export namespace spinal {
        type Pbr<T extends Model = any> = _Pbr<T>;
    }
}
export {};
