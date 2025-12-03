/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import { FileSystem } from '../FileSystem/FileSystem';
import type { IFlatModelMap } from '../interfaces/IFlatModelMap';
import type { IFsData } from '../interfaces/IFsData';
import type { IStateMap } from '../interfaces/IStateMap';
import type { SpinalOnChangeBindModel } from '../interfaces/SpinalOnChangeBindModel';
import { ModelProcessManager } from '../ModelProcessManager';
import { BindProcess } from '../Processes/BindProcess';
import { Process } from '../Processes/Process';

/**
 * Bese representation of a Object
 * @export
 * @class Model
 */
export class Model {
  public static _constructorName: string = 'Model';
  /**
   * registered attribute names (in declaration order)
   * @type {string[]}
   * @memberof Model
   */
  public _attribute_names: string[] = [];
  /**
   * id of the model
   * @type {number}
   * @memberof Model
   */
  public model_id: number = ModelProcessManager._cur_mid++;
  /**
   * synchronized processes
   * @type {Process[]}
   * @memberof Model
   */
  public _processes: Process[] = [];
  /**
   * parent models (depending on this)
   * @type {Model[]}
   * @memberof Model
   */
  public _parents: Model[] = [];
  /**
   * "date" of previous change. We start at + 2 because
   * we consider that an initialisation is a modification.
   * @type {number}
   * @memberof Model
   */
  public _date_last_modification: number = ModelProcessManager._counter + 2;
  /**
   * id unique from server.
   * It doesn't exist at creation but added after a sync of the server
   * @type {number}
   * @memberof Model
   */
  public _server_id?: number;
  [nameAttr: string]: any;

  /**
   * Creates an instance of Model.
   * @param {*} [attr]
   * @memberof Model
   */
  public constructor(attr?: any) {
    if (attr != null) {
      this._set(attr);
    }
  }

  /**
   * Do nothing here, TBD in child if needed.
   * Called in rem_attr if have no more parent.
   * @memberof Model
   */
  public destructor(): void {}

  /**
   * return true if this (or a child of this) has changed since the previous synchronisation
   * @return {*}  {boolean}
   * @memberof Model
   */
  public has_been_modified(): boolean {
    return (
      this._date_last_modification > ModelProcessManager._counter - 2 ||
      ModelProcessManager._force_m
    );
  }

  /**
   * return true if this has changed since previous synchronisation due
   * to a direct modification (not from a child one)
   * @return {*}  {boolean}
   * @memberof Model
   */
  public has_been_directly_modified(): boolean {
    return (
      this._date_last_modification > ModelProcessManager._counter - 1 ||
      ModelProcessManager._force_m
    );
  }

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
  public bind(
    f: Process | BindProcess | SpinalOnChangeBindModel,
    onchange_construction?: boolean
  ): Process {
    if (f instanceof Process) {
      this._processes.push(f);
      f._models.push(this);
      if (onchange_construction) {
        ModelProcessManager._n_processes.set(f.process_id, f);
        ModelProcessManager._need_sync_processes();
        return f;
      }
    } else {
      return new BindProcess(this, onchange_construction, f);
    }
  }

  /**
   * @param {(Process | BindProcess | Function)} f recommanded to use Process | BindProcess, using Function can lead to error
   * @memberof Model
   */
  public unbind(f: Process | BindProcess | Function): void {
    if (f instanceof Process) {
      this._processes.splice(this._processes.indexOf(f), 1);
      f._models.splice(f._models.indexOf(this), 1);
    } else {
      for (const process of this._processes) {
        if (process instanceof BindProcess && process.f === f)
          this.unbind(process);
      }
    }
  }

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
  public get(): any {
    const res: { [key: string]: any } = {};
    for (const name of this._attribute_names) {
      Object.assign(res, { [name]: (<Model>this[name]).get() });
    }
    return res;
  }

  /**
   * modify data, using another values, or Model instances.
   * Should not be redefined (but _set should be)
   * returns true if object os modified
   *
   * @param {*} value
   * @return {*}  {boolean}
   * @memberof Model
   */
  public set(value: any): boolean {
    if (this._set(value)) {
      // change internal data
      this._signal_change();
      return true;
    }
    return false;
  }

  /**
   * modify state according to str. str can be the result of a previous @get_state
   * @param {string} str
   * @memberof Model
   */
  public set_state(str: string): void {
    const map: IStateMap<Model> = {};
    const lst = str.split('\n');
    const mid = lst.shift();
    for (const l of lst) {
      if (!l.length) {
        continue;
      }
      const s = l.split(' ');
      map[s[0]] = {
        type: s[1],
        data: s[2],
        buff: void 0,
      };
    }

    // fill / update this with data in map[ mid ]
    map[mid].buff = this;
    this._set_state(map[mid].data, map);
  }

  /**
   * return a string which describes the changes in this and children since date
   * @param {number} [date=-1]
   * @return {*}  {string}
   * @memberof Model
   */
  public get_state(date: number = -1): string {
    // get sub models
    const fmm: { [id: number]: Model } = {};
    this._get_flat_model_map(fmm, date);
    let res = this.model_id.toString();
    if (this._date_last_modification > date) {
      for (const id in fmm) {
        const obj = fmm[id];
        res += `\n${obj.model_id} ${ModelProcessManager.get_object_class(
          obj
        )} ${obj._get_state()}`;
      }
    }
    return res;
  }

  /**
   * add attribute
   * @param {{ [nameAttr: string]: any }} object
   * @memberof Model
   */
  public add_attr(object: { [nameAttr: string]: any }): void;
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
  public add_attr(
    name: string,
    instanceOfModel?: any,
    signal_change?: boolean
  ): void;
  /**
   * add attribute (p.values must contain models)
   * can be called with
   *  - name, instance of Model (two arguments)
   *  - { name_1: instance_1, name_2: instance_2, ... } (only one argument)
   * @param {(string | { [nameAttr: string]: any })} name
   * @param {*} [instanceOfModel]
   * @param {boolean} [signal_change=true]
   * @memberof Model
   */
  public add_attr(
    name: string | { [nameAttr: string]: any },
    instanceOfModel?: any,
    signal_change: boolean = true
  ): void {
    // name, model
    if (typeof name === 'string' || typeof name === 'number') {
      if (typeof instanceOfModel === 'function') {
        this[name] = instanceOfModel;
      } else {
        if (this[name] != null) {
          console.error(
            `attribute ${name} already exists in ${ModelProcessManager.get_object_class(
              this
            )}`
          );
        }
        const model: Model = ModelProcessManager.conv(instanceOfModel);
        if (model._parents.indexOf(this) < 0) {
          model._parents.push(this);
        }
        this._attribute_names.push(name);
        this[name] = model;
        if (signal_change) {
          this._signal_change();
        }
      }
    } else {
      // else, asuming { name_1: instance_1, name_2: instance_2, ... }
      for (const key in name) {
        if (Object.prototype.hasOwnProperty.call(name, key)) {
          const val = name[key];
          this.add_attr(key, val, signal_change);
        }
      }
    }
  }

  /**
   * remove attribute named name
   * @param {string} name
   * @param {boolean} [signal_change=true]
   * @memberof Model
   */
  public rem_attr(name: string, signal_change: boolean = true): void {
    const item = this[name];
    if (item instanceof Model) {
      let i = item._parents.indexOf(this);
      if (i >= 0) {
        item._parents.splice(i, 1);
        if (item._parents.length === 0) {
          item.destructor();
        }
      }
      delete this[name];
      i = this._attribute_names.indexOf(name);
      if (i >= 0) {
        this._attribute_names.splice(i, 1);
      }
      if (signal_change) {
        this._signal_change();
      }
    }
  }

  /**
   * change attribute named nname to instanceOfModel (use references for comparison)
   * @param {string} name
   * @param {*} instanceOfModel
   * @param {boolean} [signal_change=true]
   * @return {*}  {void}
   * @memberof Model
   */
  public mod_attr(
    name: string,
    instanceOfModel: any,
    signal_change: boolean = true
  ): void {
    if (this[name] !== instanceOfModel) {
      this.rem_attr(name);
      return this.add_attr(name, instanceOfModel, signal_change);
    }
  }

  /**
   * add / mod / rem attr to get the same data than o
   *  (assumed to be something like { key: val, ... })
   * @param {{ [key: string]: any }} instanceOfModel
   * @memberof Model
   */
  public set_attr(instanceOfModel: { [key: string]: any }): void {
    // new ones / updates
    for (const k in instanceOfModel) {
      this.mod_attr(k, instanceOfModel[k]);
    }
    this._attribute_names
      .filter((attrName: string): boolean => instanceOfModel[attrName] == null)
      .forEach((attrName: string): void => this.rem_attr(attrName));
  }

  /**
   * dimension of the object -> [] for a scalar, [ length ] for a vector,
   *  [ nb_row, nb_cols ] for a matrix...
   * @param {number} [_for_display=0]
   * @return {*}  {(number | number[])}
   * @memberof Model
   */
  public size(_for_display: number = 0): number | number[] {
    return [];
  }

  /**
   * dimensionnality of the object -> 0 for a scalar, 1 for a vector, ...
   * @param {number} [_for_display=0]
   * @return {*}  {number}
   * @memberof Model
   */
  public dim(_for_display: number = 0): number {
    const size = this.size(_for_display);
    return Array.isArray(size) ? size.length : size;
  }

  /**
   * @param {Model} m
   * @return {*}  {boolean}
   * @memberof Model
   */
  public equals(m: Model): boolean {
    if (this === m) return true;
    if (this._attribute_names.length !== m._attribute_names.length)
      return false;
    // check all own attrs exist in target
    for (const attrName of this._attribute_names) {
      if (!m._attribute_names.includes(attrName)) {
        return false;
      }
    }
    // check target attrs exist in own and is equal
    for (const attrName of m._attribute_names) {
      if (this[attrName] == null) {
        return false;
      }
      const attrModel: Model = m[attrName];
      if (!this[attrName].equals(attrModel)) {
        return false;
      }
    }
    return true;
  }

  /**
   * get first parents that checks func_to_check
   * @param {(model: Model) => boolean} func_to_check
   * @return {*}  {Model[]}
   * @memberof Model
   */
  public get_parents_that_check(
    func_to_check: (model: Model) => boolean
  ): Model[] {
    const res: Model[] = [];
    const visited: {
      [attrName: string]: boolean;
    } = {};
    this._get_parents_that_check_rec(res, visited, func_to_check);
    return res;
  }

  /**
   * @return {*}  {Model}
   * @memberof Model
   */
  public deep_copy(): Model {
    const tmp: { [key: string]: Model } = {};
    for (const key of this._attribute_names) {
      tmp[key] = this[key].deep_copy();
    }
    const res: any = new ModelProcessManager._def[
      ModelProcessManager.get_object_class(this)
    ]();
    res.set_attr(tmp);
    return res;
  }

  /**
   * returns true if change is not "cosmetic"
   * @return {*}  {boolean}
   * @memberof Model
   */
  public real_change(): boolean {
    if (this.has_been_directly_modified() && !this._attribute_names.length) {
      return true;
    }
    for (const attrNames of this._attribute_names) {
      if (
        typeof this.cosmetic_attribute === 'function'
          ? this.cosmetic_attribute(attrNames)
          : null
      ) {
        continue;
      }
      if (this[attrNames].real_change()) {
        return true;
      }
    }
    return false;
  }

  /**
   * To be redifined in children if needed
   * @param {string} name
   * @return {*}  {boolean}
   * @memberof Model
   */
  public cosmetic_attribute(name: string): boolean {
    return false;
  }

  /**
   * may be redefined
   * @return {*}  {string}
   * @memberof Model
   */
  protected _get_state(): string {
    return this._attribute_names
      .map(
        (attrName: string): string => `${attrName}:${this[attrName].model_id}`
      )
      .join(',');
  }

  /**
   * send data to server
   * @param {IFsData} out
   * @return {*}  {string}
   * @memberof Model
   */
  public _get_fs_data(out: IFsData): void {
    FileSystem.set_server_id_if_necessary(out, this);
    const data = this._attribute_names
      .map((attrName: string): string => {
        const obj: Model = this[attrName];
        FileSystem.set_server_id_if_necessary(out, obj);
        return attrName + ':' + obj._server_id;
      })
      .join(',');
    out.mod += `C ${this._server_id} ${data} `;
  }

  /**
   * may be redefined.
   * by default, add attributes using keys and values (and remove old unused values)
   * must return true if data is changed
   * @protected
   * @param {*} value
   * @return {*}  {boolean}
   * @memberof Model
   */
  protected _set(value: any): boolean {
    let change = 0;
    const used: { [attrName: string]: boolean } = {};

    // rem
    for (const attrName of ModelProcessManager._get_attribute_names(value)) {
      used[attrName] = true;
    }
    for (const key of this._attribute_names) {
      if (!used[key]) {
        change = 1;
        this.rem_attr(key, false);
      }
    }

    // mod / add
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const val: Model = value[key];
        if (val != null) {
          if (this[key] != null) {
            if (this[key].constructor === val.constructor) {
              change |= this[key].set(val);
            } else {
              change = 1;
              this.mod_attr(key, val, false);
            }
          } else {
            this.add_attr(key, val, false);
          }
        }
      }
    }
    return !!change;
  }

  /**
   * called by set. change_level should not be defined by the user
   *  (it permits to != change from child of from this)
   * @protected
   * @param {number} [change_level=2]
   * @return {*}  {ReturnType<typeof setTimeout>}
   * @memberof Model
   */
  protected _signal_change(
    change_level: number = 2
  ): ReturnType<typeof setTimeout> {
    if (change_level === 2 && this._server_id != null) {
      FileSystem.signal_change(this);
    }
    // register this as a modified model
    ModelProcessManager._modlist.set(this.model_id, this);
    // do the same thing for the parents
    if (this._date_last_modification <= ModelProcessManager._counter) {
      this._date_last_modification =
        ModelProcessManager._counter + change_level;
      for (const parent of this._parents) {
        parent._signal_change(1);
      }
    }
    // start if not done a timer
    return ModelProcessManager._need_sync_processes();
  }

  /**
   * generic definition of _set_state. ( called by _use_state )
   * @param {string} str
   * @param {IStateMap} map
   * @memberof Model
   */
  public _set_state(str: string, map: IStateMap<Model>): void {
    const used: { [attrName: string]: boolean } = {}; // used attributes. Permits to know what to destroy
    if (str.length) {
      for (const spl of str.split(',')) {
        const [attr, k_id] = spl.split(':');
        used[attr] = true;
        const model: Model = this[attr];
        if (map[k_id].buff != null) {
          // if already defined in the map
          if (model == null) {
            this.add_attr(attr, map[k_id].buff);
          } else if (map[k_id].buff !== model) {
            this.mod_attr(attr, map[k_id].buff);
          }
        } else if (model == null) {
          // else, if the attribute does not exist, we create if
          this.add_attr(
            attr,
            ModelProcessManager._new_model_from_state(k_id, map)
          );
        } else if (!model._set_state_if_same_type(k_id, map)) {
          // else, we already have an attribute and map has not been already explored
          this.mod_attr(
            attr,
            ModelProcessManager._new_model_from_state(k_id, map)
          );
        }
      }
    }
    for (const attrName of this._attribute_names) {
      if (!used[attrName]) this.rem_attr(attrName);
    }
  }

  /**
   * see get_parents_that_check
   * @private
   * @param {Model[]} res
   * @param {{ [attrName: string]: boolean }} visited
   * @param {(model: Model) => boolean} func_to_check
   * @memberof Model
   */
  private _get_parents_that_check_rec(
    res: Model[],
    visited: { [attrName: string]: boolean },
    func_to_check: (model: Model) => boolean
  ): void {
    if (visited[this.model_id] == null) {
      visited[this.model_id] = true;
      if (func_to_check(this)) {
        res.push(this);
      } else {
        for (const parent of this._parents) {
          parent._get_parents_that_check_rec(res, visited, func_to_check);
        }
      }
    }
  }

  /**
   * return true if info from map[ mid ] if compatible with this.
   * If it's the case, use this information to update data
   * @protected
   * @param {string} mid
   * @param {IStateMap<Model>} map
   * @return {*}  {boolean}
   * @memberof Model
   */
  protected _set_state_if_same_type(
    mid: string,
    map: IStateMap<Model>
  ): boolean {
    const dat = map[mid];
    if (ModelProcessManager.get_object_class(this) === dat.type) {
      dat.buff = this;
      this._set_state(dat.data, map);
      return true;
    }
    return false;
  }

  /**
   * map[ id ] = obj for each objects starting from this recursively
   * @protected
   * @param {IFlatModelMap} map
   * @param {number} date
   * @return {*}  {IFlatModelMap}
   * @memberof Model
   */
  protected _get_flat_model_map(
    map: IFlatModelMap,
    date: number
  ): IFlatModelMap {
    map[this.model_id] = this;
    for (const name of this._attribute_names) {
      const obj: Model = this[name];
      if (map[obj.model_id] == null) {
        if (obj._date_last_modification > date) {
          obj._get_flat_model_map(map, date);
        }
      }
    }
    return map;
  }
}

type ModelAlias = Model;
declare global {
  export namespace spinal {
    export type Model = ModelAlias;
  }
}
