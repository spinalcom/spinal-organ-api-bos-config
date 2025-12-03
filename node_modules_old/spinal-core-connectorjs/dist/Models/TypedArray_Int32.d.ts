import { TypedArray } from './TypedArray';
export declare class TypedArray_Int32 extends TypedArray<Int32Array> {
    static _constructorName: string;
    /**
     * Creates an instance of TypedArray_Int32.
     * @param {(number | number[])} [size]
     * @param {Int32Array} [data]
     * @memberof TypedArray_Int32
     */
    constructor(size?: number | number[], data?: Int32Array);
    /**
     * @return {*}  {typeof TypedArray_Int32}
     * @memberof TypedArray_Int32
     */
    base_type(): typeof TypedArray_Int32;
    /**
     * @return {*}  {TypedArray_Int32}
     * @memberof TypedArray_Int32
     */
    deep_copy(): TypedArray_Int32;
}
