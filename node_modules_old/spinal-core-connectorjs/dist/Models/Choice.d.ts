import type { Lst } from './Lst';
import { Model } from './Model';
import type { Str } from './Str';
import type { Val } from './Val';
/**
 * @export
 * @class Choice
 * @extends {Model}
 */
export declare class Choice extends Model {
    /**
     * @static
     * @type {string}
     * @memberof Choice
     */
    static _constructorName: string;
    /**
     * @type {Val}
     * @memberof Choice
     */
    num: Val;
    /**
     *
     * @type {Lst<Str>}
     * @memberof Choice
     */
    lst: Lst<Str>;
    /**
     * Creates an instance of Choice.
     * @param {(Val | number)} [InitIdx]
     * @param {((string | Str)[])} [stringChoises]
     * @memberof Choice
     */
    constructor(InitIdx?: Val | number, stringChoises?: (string | Str)[]);
    /**
     * @return {*}  {boolean}
     * @memberof Choice
     */
    filter(): boolean;
    /**
     * @return {*}  {Str} the seleected value
     * @memberof Choice
     */
    item(): Str;
    /**
     * @return {*}  {string} the seleected value
     * @memberof Choice
     */
    get(): string;
    /**
     * @return {*}  {string}
     * @memberof Choice
     */
    toString(): string;
    /**
     * @param {(Choice | Str)} a
     * @return {*}  {boolean}
     * @memberof Choice
     */
    equals(a: Choice | Str): boolean;
    /**
     * @protected
     * @param {(string | number)} value
     * @return {*}  {boolean}
     * @memberof Choice
     */
    protected _set(value: string | number): boolean;
}
