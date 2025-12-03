import { TypedArray } from './TypedArray';
/**
 * @export
 * @class TypedArray_Float64
 * @extends {TypedArray<Float64Array>}
 */
export declare class TypedArray_Float64 extends TypedArray<Float64Array> {
    static _constructorName: string;
    /**
     * Creates an instance of TypedArray_Float64.
     * @param {(number | number[])} [size]
     * @param {Float64Array} [data]
     * @memberof TypedArray_Float64
     */
    constructor(size?: number | number[], data?: Float64Array);
    /**
     * @return {*}  {typeof TypedArray_Float64}
     * @memberof TypedArray_Float64
     */
    base_type(): typeof TypedArray_Float64;
    /**
     * @return {*}  {TypedArray_Float64}
     * @memberof TypedArray_Float64
     */
    deep_copy(): TypedArray_Float64;
}
