import { Model } from 'spinal-core-connectorjs';
import type { SpinalSetForEachFunc } from './interfaces/SpinalSetForEachFunc';
/**
 * @class SpinalSet
 * @extends {Model}
 */
declare class SpinalSet extends Model {
    /**
     * Constructor for the SpinalSet class.
     * @param {(string[]|IterableIterator<string>)} [init] Array of values
     * @throws {TypeError} If init is not iterable
     * @throws {TypeError} If init[Symbol.iterator] doesn't return iterators
     * @throws {TypeError} If the values of the iterators are not strings
     * @memberof SpinalSet
     */
    constructor(init?: string[] | IterableIterator<string>);
    /**
     * Appends a new element with the given value to the set.
     * @param {String} value Value to store in the set
     * @throws {TypeError} If the value is not a string
     * @memberof SpinalSet
     */
    add(value: string): void;
    /**
     * Returns a boolean asserting whether the value is in the set or not.
     * @param {string} value Value
     * @returns {boolean} Return true if the value exists
     * @throws {TypeError} If the value is not a string
     * @memberof SpinalSet
     */
    has(value: string): boolean;
    /**
     * Returns an array that contains all the values of the set.
     * @returns {string[]} Array containing all the values in the set
     * @memberof SpinalSet
     */
    values(): string[];
    /**
     * Deletes an element.
     * @param {string} value Value to delete
     * @throws {TypeError} If the value is not a string
     * @throws {Error} If the value is not in the map
     * @memberof SpinalSet
     */
    delete(value: string): void;
    /**
     * Deletes all values in the set.
     * @memberof SpinalSet
     */
    clear(): void;
    /**
     * Returns the number of values in the set.
     * @returns {number} Number of values in the set
     * @memberof SpinalSet
     */
    size(): number;
    /**
     * Applies a function to each of the values in the set.
     * @param {SpinalSetForEachFunc} fun Funcion to apply
     * @memberof SpinalSet
     */
    forEach(fun: SpinalSetForEachFunc): void;
    /**
     * Function to iterate over the set object.
     * @returns {IterableIterator<string>}
     * @memberof SpinalSet
     */
    [Symbol.iterator](): IterableIterator<string>;
}
export default SpinalSet;
export { SpinalSet };
