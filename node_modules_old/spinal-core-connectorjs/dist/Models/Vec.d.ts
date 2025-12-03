import { Lst } from './Lst';
import { Val } from './Val';
export declare class Vec extends Lst<Val> {
    static _constructorName: string;
    /**
     * Creates an instance of Vec.
     * @memberof Vec
     */
    constructor();
    /**
     * @return {*}  {typeof Val}
     * @memberof Vec
     */
    base_type(): typeof Val;
    /**
     * @return {*}  {string}
     * @memberof Vec
     */
    _underlying_fs_type(): string;
}
