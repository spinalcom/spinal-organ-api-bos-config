import type { IFlatModelMap } from '../interfaces/IFlatModelMap';
import type { IFsData } from '../interfaces/IFsData';
import type { IStateMap } from '../interfaces/IStateMap';
import type { SpinalOnChangeBindModel } from '../interfaces/SpinalOnChangeBindModel';
import { BindProcess } from '../Processes/BindProcess';
import { Process } from '../Processes/Process';
/**
 * Bese representation of a Object
 * @export
 * @class Model
 */
export declare class Model {
    static _constructorName: string;
    /**
     * registered attribute names (in declaration order)
     * @type {string[]}
     * @memberof Model
     */
    _attribute_names: string[];
    /**
     * id of the model
     * @type {number}
     * @memberof Model
     */
    model_id: number;
    /**
     * synchronized processes
     * @type {Process[]}
     * @memberof Model
     */
    _processes: Process[];
    /**
     * parent models (depending on this)
     * @type {Model[]}
     * @memberof Model
     */
    _parents: Model[];
    /**
     * "date" of previous change. We start at + 2 because
     * we consider that an initialisation is a modification.
     * @type {number}
     * @memberof Model
     */
    _date_last_modification: number;
    /**
     * id unique from server.
     * It doesn't exist at creation but added after a sync of the server
     * @type {number}
     * @memberof Model
     */
    _server_id?: number;
    [nameAttr: string]: any;
    /**
     * Creates an instance of Model.
     * @param {*} [attr]
     * @memberof Model
     */
    constructor(attr?: any);
    /**
     * Do nothing here, TBD in child if needed.
     * Called in rem_attr if have no more parent.
     * @memberof Model
     */
    destructor(): void;
    /**
     * return true if this (or a child of this) has changed since the previous synchronisation
     * @return {*}  {boolean}
     * @memberof Model
     */
    has_been_modified(): boolean;
    /**
     * return true if this has changed since previous synchronisation due
     * to a direct modification (not from a child one)
     * @return {*}  {boolean}
     * @memberof Model
     */
    has_been_directly_modified(): boolean;
    /**
     * if this has been modified during the preceding round, f will be called
     * If f is a process:
     *  process.onchange will be called each time this (or a child of this) will be modified.
     *  process.destructor will be called if this is destroyed.
     *  ...
     *  can be seen as a bind with an object
     * @param {(Process | (() => void))} f
     * @param {boolean} [onchange_construction=true]  true means that onchange will be automatically called after the bind
     * @return {*}  {Process}
     * @memberof Model
     */
    bind(f: Process | BindProcess | SpinalOnChangeBindModel, onchange_construction?: boolean): Process;
    /**
     * @param {(Process | BindProcess | Function)} f recommanded to use Process | BindProcess, using Function can lead to error
     * @memberof Model
     */
    unbind(f: Process | BindProcess | Function): void;
    /**
     * return a copy of data in a "standard" representation (e.g. string, number, objects, ...)
     * users are encouraged to use Models as much as possible
     * (meaning that get should not be called for every manipulation),
     * adding methods for manipulation of data if necessary
     * (e.g. toggle, find, ... in Lst, Str, ...).
     * May be redefined for specific types (e.g. Str, Lst, ...)
     * @return {*}  {*}
     * @memberof Model
     */
    get(): any;
    /**
     * modify data, using another values, or Model instances.
     * Should not be redefined (but _set should be)
     * returns true if object os modified
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof Model
     */
    set(value: any): boolean;
    /**
     * modify state according to str. str can be the result of a previous @get_state
     * @param {string} str
     * @memberof Model
     */
    set_state(str: string): void;
    /**
     * return a string which describes the changes in this and children since date
     * @param {number} [date=-1]
     * @return {*}  {string}
     * @memberof Model
     */
    get_state(date?: number): string;
    /**
     * add attribute
     * @param {{ [nameAttr: string]: any }} object
     * @memberof Model
     */
    add_attr(object: {
        [nameAttr: string]: any;
    }): void;
    /**
     * @param {string} name
     * @param {*} [instanceOfModel]
     * @param {boolean} [signal_change]
     * @memberof Model
     */
    /**
     * add attribute
     * @param {string} name
     * @param {*} [instanceOfModel]
     * @param {boolean} [signal_change]
     * @memberof Model
     */
    add_attr(name: string, instanceOfModel?: any, signal_change?: boolean): void;
    /**
     * remove attribute named name
     * @param {string} name
     * @param {boolean} [signal_change=true]
     * @memberof Model
     */
    rem_attr(name: string, signal_change?: boolean): void;
    /**
     * change attribute named nname to instanceOfModel (use references for comparison)
     * @param {string} name
     * @param {*} instanceOfModel
     * @param {boolean} [signal_change=true]
     * @return {*}  {void}
     * @memberof Model
     */
    mod_attr(name: string, instanceOfModel: any, signal_change?: boolean): void;
    /**
     * add / mod / rem attr to get the same data than o
     *  (assumed to be something like { key: val, ... })
     * @param {{ [key: string]: any }} instanceOfModel
     * @memberof Model
     */
    set_attr(instanceOfModel: {
        [key: string]: any;
    }): void;
    /**
     * dimension of the object -> [] for a scalar, [ length ] for a vector,
     *  [ nb_row, nb_cols ] for a matrix...
     * @param {number} [_for_display=0]
     * @return {*}  {(number | number[])}
     * @memberof Model
     */
    size(_for_display?: number): number | number[];
    /**
     * dimensionnality of the object -> 0 for a scalar, 1 for a vector, ...
     * @param {number} [_for_display=0]
     * @return {*}  {number}
     * @memberof Model
     */
    dim(_for_display?: number): number;
    /**
     * @param {Model} m
     * @return {*}  {boolean}
     * @memberof Model
     */
    equals(m: Model): boolean;
    /**
     * get first parents that checks func_to_check
     * @param {(model: Model) => boolean} func_to_check
     * @return {*}  {Model[]}
     * @memberof Model
     */
    get_parents_that_check(func_to_check: (model: Model) => boolean): Model[];
    /**
     * @return {*}  {Model}
     * @memberof Model
     */
    deep_copy(): Model;
    /**
     * returns true if change is not "cosmetic"
     * @return {*}  {boolean}
     * @memberof Model
     */
    real_change(): boolean;
    /**
     * To be redifined in children if needed
     * @param {string} name
     * @return {*}  {boolean}
     * @memberof Model
     */
    cosmetic_attribute(name: string): boolean;
    /**
     * may be redefined
     * @return {*}  {string}
     * @memberof Model
     */
    protected _get_state(): string;
    /**
     * send data to server
     * @param {IFsData} out
     * @return {*}  {string}
     * @memberof Model
     */
    _get_fs_data(out: IFsData): void;
    /**
     * may be redefined.
     * by default, add attributes using keys and values (and remove old unused values)
     * must return true if data is changed
     * @protected
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof Model
     */
    protected _set(value: any): boolean;
    /**
     * called by set. change_level should not be defined by the user
     *  (it permits to != change from child of from this)
     * @protected
     * @param {number} [change_level=2]
     * @return {*}  {ReturnType<typeof setTimeout>}
     * @memberof Model
     */
    protected _signal_change(change_level?: number): ReturnType<typeof setTimeout>;
    /**
     * generic definition of _set_state. ( called by _use_state )
     * @param {string} str
     * @param {IStateMap} map
     * @memberof Model
     */
    _set_state(str: string, map: IStateMap<Model>): void;
    /**
     * see get_parents_that_check
     * @private
     * @param {Model[]} res
     * @param {{ [attrName: string]: boolean }} visited
     * @param {(model: Model) => boolean} func_to_check
     * @memberof Model
     */
    private _get_parents_that_check_rec;
    /**
     * return true if info from map[ mid ] if compatible with this.
     * If it's the case, use this information to update data
     * @protected
     * @param {string} mid
     * @param {IStateMap<Model>} map
     * @return {*}  {boolean}
     * @memberof Model
     */
    protected _set_state_if_same_type(mid: string, map: IStateMap<Model>): boolean;
    /**
     * map[ id ] = obj for each objects starting from this recursively
     * @protected
     * @param {IFlatModelMap} map
     * @param {number} date
     * @return {*}  {IFlatModelMap}
     * @memberof Model
     */
    protected _get_flat_model_map(map: IFlatModelMap, date: number): IFlatModelMap;
}
declare type ModelAlias = Model;
declare global {
    export namespace spinal {
        type Model = ModelAlias;
    }
}
export {};
