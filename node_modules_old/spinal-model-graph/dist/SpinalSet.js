"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalSet = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
/**
 * @class SpinalSet
 * @extends {Model}
 */
class SpinalSet extends spinal_core_connectorjs_1.Model {
    /**
     * Constructor for the SpinalSet class.
     * @param {(string[]|IterableIterator<string>)} [init] Array of values
     * @throws {TypeError} If init is not iterable
     * @throws {TypeError} If init[Symbol.iterator] doesn't return iterators
     * @throws {TypeError} If the values of the iterators are not strings
     * @memberof SpinalSet
     */
    constructor(init) {
        super();
        if (init !== undefined) {
            for (const value of init) {
                this.add(value);
            }
        }
    }
    /**
     * Appends a new element with the given value to the set.
     * @param {String} value Value to store in the set
     * @throws {TypeError} If the value is not a string
     * @memberof SpinalSet
     */
    add(value) {
        if (typeof value !== 'string') {
            throw TypeError('The value must be a string');
        }
        this.mod_attr(value, 0);
    }
    /**
     * Returns a boolean asserting whether the value is in the set or not.
     * @param {string} value Value
     * @returns {boolean} Return true if the value exists
     * @throws {TypeError} If the value is not a string
     * @memberof SpinalSet
     */
    has(value) {
        if (typeof value !== 'string') {
            throw TypeError('The value must be a string');
        }
        return this.hasOwnProperty(value);
    }
    /**
     * Returns an array that contains all the values of the set.
     * @returns {string[]} Array containing all the values in the set
     * @memberof SpinalSet
     */
    values() {
        return this._attribute_names;
    }
    /**
     * Deletes an element.
     * @param {string} value Value to delete
     * @throws {TypeError} If the value is not a string
     * @throws {Error} If the value is not in the map
     * @memberof SpinalSet
     */
    delete(value) {
        if (!this.has(value)) {
            throw Error("The value doesn't exist");
        }
        this.rem_attr(value);
    }
    /**
     * Deletes all values in the set.
     * @memberof SpinalSet
     */
    clear() {
        const values = this.values();
        while (values[0]) {
            this.delete(values[0]);
        }
    }
    /**
     * Returns the number of values in the set.
     * @returns {number} Number of values in the set
     * @memberof SpinalSet
     */
    size() {
        return this._attribute_names.length;
    }
    /**
     * Applies a function to each of the values in the set.
     * @param {SpinalSetForEachFunc} fun Funcion to apply
     * @memberof SpinalSet
     */
    forEach(fun) {
        if (typeof fun !== 'function') {
            throw TypeError('The callback must be a function');
        }
        const values = this.values();
        for (let i = 0; i < this.size(); i += 1) {
            fun(values[i], i);
        }
    }
    /**
     * Function to iterate over the set object.
     * @returns {IterableIterator<string>}
     * @memberof SpinalSet
     */
    *[Symbol.iterator]() {
        const values = this._attribute_names;
        for (const value of values) {
            yield value;
        }
    }
}
exports.SpinalSet = SpinalSet;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalSet]);
exports.default = SpinalSet;
//# sourceMappingURL=SpinalSet.js.map