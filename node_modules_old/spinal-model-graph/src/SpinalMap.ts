/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { Model, spinalCore } from 'spinal-core-connectorjs';
import type { ArrayPairStringAny } from './interfaces/ArrayPairStringAny';
import type { SpinalMapForEachFunc } from './interfaces/SpinalMapForEachFunc';
import type { SpinalMapItem } from './interfaces/SpinalMapItem';

/**
 * @class SpinalMap
 * @extends {Model}
 * @template T
 */
class SpinalMap<T extends Model = any> extends Model {
  /**
   * Constructor for the SpinalMap class.
   * @param {Array<ArrayPairStringAny>} [init] Array of arrays of key-value pairs
   * @throws {TypeError} If init is not iterable
   * @throws {TypeError} If init[Symbol.iterator] doesn't return iterators
   * @throws {TypeError} If the values of the iterators are not arrays of key values
   * @throws {TypeError} If the keys of the values of the iterators are not strings
   * @memberof SpinalMap
   */
  constructor(init?: ArrayPairStringAny[]) {
    super();
    if (init !== undefined) {
      for (const [key, value] of init) {
        this.setElement(key, value);
      }
    }
  }

  /**
   * Sets the value corresponding to the key.
   * @param {string} key Key to the value
   * @param {T} value New value
   * @throws {TypeError} If the key is not a string
   * @memberof SpinalMap
   */
  setElement(key: string, value: any): void {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw TypeError('The key must be a string or a number');
    }

    this.rem_attr(key);
    const attribute = {
      [key]: value,
    };
    this.add_attr(attribute);
  }

  /**
   * Returns the value associated to the key, or undefined if there is none.
   * @param {string} key Key to the value
   * @returns {T} Value corresponding to the key
   * @memberof SpinalMap
   */
  getElement(key: string): T {
    return this[key];
  }

  /**
   * Returns a boolean asserting whether a value has been associated to the key or not.
   * @param {string} key
   * @returns {boolean} Return true if the key exists
   * @throws {TypeError} If the key is not a string
   * @memberof SpinalMap
   */
  has(key: string): boolean {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw TypeError('The key must be a string or a number');
    }

    return this._attribute_names.includes(key);
  }

  /**
   * Returns a boolean asserting whether the map contains any key.
   * @returns {boolean} Return true if the map contains at least one key
   * @memberof SpinalMap
   */
  hasKey(): boolean {
    return this._attribute_names.length > 0;
  }

  /**
   * Returns an array that contains the keys for each element in the map in insertion order.
   * @returns {string[]} Array containing all the keys in the map
   * @memberof SpinalMap
   */
  keys(): string[] {
    return this._attribute_names;
  }

  /**
   * Returns an array that contains the keys and the values
   * for each element in the map in insertion order.
   * @returns {Array<Array<string,T>>} Array containing all the keys and values in the map
   * @memberof SpinalMap
   */
  entries(): SpinalMapItem<T>[] {
    const arr = [];

    for (const key of this.keys()) {
      arr.push([key, this.getElement(key)]);
    }

    return arr;
  }

  /**
   * Deletes an element.
   * @param {string} key Key of the element
   * @throws {TypeError} If the key is not a string
   * @throws {Error} If the key is not in the map
   * @memberof SpinalMap
   */
  delete(key: string): void {
    if (!this.has(key)) {
      throw Error("The key doesn't exist");
    }

    this.rem_attr(key);
  }

  /**
   * Deletes all elements.
   * @memberof SpinalMap
   */
  clear(): void {
    const keys = this.keys();

    while (keys[0]) {
      this.delete(keys[0]);
    }
  }

  /**
   * Applies a function to each of the values in the map.
   * @param {SpinalMapForEachFunc<T>} fun Funcion to apply
   * @memberof SpinalMap
   */
  forEach(fun: SpinalMapForEachFunc<T>): void {
    if (typeof fun !== 'function') {
      throw TypeError('The callback must be a function');
    }

    for (const [key, value] of this) {
      fun(value, key);
    }
  }

  /**
   * Function to iterate over the map object.
   * @returns {IterableIterator<T>}
   * @memberof SpinalMap
   */
  *[Symbol.iterator](): IterableIterator<SpinalMapItem<T>> {
    const keys = this.keys();

    for (const key of keys) {
      yield [key, this[key]];
    }
  }
}

spinalCore.register_models([SpinalMap]);
export default SpinalMap;
export { SpinalMap };
