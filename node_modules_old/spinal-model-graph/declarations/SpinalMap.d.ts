import { Model } from 'spinal-core-connectorjs';
import type { ArrayPairStringAny } from './interfaces/ArrayPairStringAny';
import type { SpinalMapForEachFunc } from './interfaces/SpinalMapForEachFunc';
import type { SpinalMapItem } from './interfaces/SpinalMapItem';
/**
 * @class SpinalMap
 * @extends {Model}
 * @template T
 */
declare class SpinalMap<T extends Model = any> extends Model {
    /**
     * Constructor for the SpinalMap class.
     * @param {Array<ArrayPairStringAny>} [init] Array of arrays of key-value pairs
     * @throws {TypeError} If init is not iterable
     * @throws {TypeError} If init[Symbol.iterator] doesn't return iterators
     * @throws {TypeError} If the values of the iterators are not arrays of key values
     * @throws {TypeError} If the keys of the values of the iterators are not strings
     * @memberof SpinalMap
     */
    constructor(init?: ArrayPairStringAny[]);
    /**
     * Sets the value corresponding to the key.
     * @param {string} key Key to the value
     * @param {T} value New value
     * @throws {TypeError} If the key is not a string
     * @memberof SpinalMap
     */
    setElement(key: string, value: any): void;
    /**
     * Returns the value associated to the key, or undefined if there is none.
     * @param {string} key Key to the value
     * @returns {T} Value corresponding to the key
     * @memberof SpinalMap
     */
    getElement(key: string): T;
    /**
     * Returns a boolean asserting whether a value has been associated to the key or not.
     * @param {string} key
     * @returns {boolean} Return true if the key exists
     * @throws {TypeError} If the key is not a string
     * @memberof SpinalMap
     */
    has(key: string): boolean;
    /**
     * Returns a boolean asserting whether the map contains any key.
     * @returns {boolean} Return true if the map contains at least one key
     * @memberof SpinalMap
     */
    hasKey(): boolean;
    /**
     * Returns an array that contains the keys for each element in the map in insertion order.
     * @returns {string[]} Array containing all the keys in the map
     * @memberof SpinalMap
     */
    keys(): string[];
    /**
     * Returns an array that contains the keys and the values
     * for each element in the map in insertion order.
     * @returns {Array<Array<string,T>>} Array containing all the keys and values in the map
     * @memberof SpinalMap
     */
    entries(): SpinalMapItem<T>[];
    /**
     * Deletes an element.
     * @param {string} key Key of the element
     * @throws {TypeError} If the key is not a string
     * @throws {Error} If the key is not in the map
     * @memberof SpinalMap
     */
    delete(key: string): void;
    /**
     * Deletes all elements.
     * @memberof SpinalMap
     */
    clear(): void;
    /**
     * Applies a function to each of the values in the map.
     * @param {SpinalMapForEachFunc<T>} fun Funcion to apply
     * @memberof SpinalMap
     */
    forEach(fun: SpinalMapForEachFunc<T>): void;
    /**
     * Function to iterate over the map object.
     * @returns {IterableIterator<T>}
     * @memberof SpinalMap
     */
    [Symbol.iterator](): IterableIterator<SpinalMapItem<T>>;
}
export default SpinalMap;
export { SpinalMap };
