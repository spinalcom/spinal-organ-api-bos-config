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

import type { ISpinalModel } from './interfaces/ISpinalModels';
import type { IStateMap } from './interfaces/IStateMap';
import type { SpinalType } from './interfaces/SpinalType';
import { Bool } from './Models/Bool';
import { Lst } from './Models/Lst';
import { Model } from './Models/Model';
import { Str } from './Models/Str';
import { Val } from './Models/Val';
import type { Process } from './Processes/Process';
import { isIterable } from './Utils/isIterable';

export class ModelProcessManager {
  // nb "change rounds" since the beginning ( * 2 to differenciate direct and indirect changes )
  public static _counter: number = 0;
  // changed models (current round)
  public static _modlist: Map<number, Model> = new Map();
  // new processes (that will need a first onchange call in "force" mode)
  public static _n_processes: Map<number, Process> = new Map();
  // current model id (used to create new ids)
  public static _cur_mid: number = 0;
  // current process id (used to create new ids)
  public static _cur_process_id: number = 0;
  // timer used to create a new "round"
  public static _timeout: ReturnType<typeof setTimeout> = undefined;
  // if _force_m == true, every has_been_modified function will return true
  public static _force_m: boolean = false;

  public static _def: ISpinalModel = {};

  public static new_from_state(): void {
    throw 'function obsolete';
  }
  public static load(): void {
    throw 'function obsolete';
  }

  /**
   * translate a normal javascript to their spinal model connter part
   * @public
   * @param {*} v
   * @return {*}  {Model}
   */
  public static conv(v: Model): Model;
  public static conv(v: any[]): Lst<any>;
  public static conv(v: string): Str;
  public static conv(v: number): Val;
  public static conv(v: boolean): Bool;
  public static conv(v: any): Model;
  public static conv(v: any): Model {
    if (v instanceof Model) return v;
    if (v instanceof Array) return new Lst(v);
    if (typeof v === 'string') return new Str(v);
    if (typeof v === 'number') return new Val(v);
    if (typeof v === 'boolean') return new Bool(v);
    return new Model(v);
  }

  /**
   * @public
   * @param {Model} obj
   * @return {*}  {string}
   */
  public static get_object_class(obj: Model): string {
    if (obj?.constructor) {
      if ('_constructorName' in obj.constructor)
        // @ts-ignore
        return obj.constructor._constructorName;
      if ('name' in obj.constructor) return obj.constructor.name;
      if ('toString' in obj.constructor) {
        let arr = obj.constructor.toString().match(/class\s*(\w+)/);
        if (!arr) {
          arr = obj.constructor.toString().match(/function\s*(\w+)/);
        }
        if (arr?.length === 2) {
          return arr[1];
        }
      }
    }
  }

  /**
   * @public
   * @param {(Model | object)} m
   * @return {*}  {string[]}
   */
  public static _get_attribute_names(m: Model | object): string[] {
    if (m instanceof Model) {
      return m._attribute_names;
    }
    const res: string[] = [];
    for (const key in m) {
      if (Object.prototype.hasOwnProperty.call(m, key)) {
        res.push(key);
      }
    }
    return res;
  }

  /**
   * create a Model using a line of get_state(using.type, .data, ...)
   * @public
   * @template T
   * @param {string} mid
   * @param {IStateMap<T>} map
   * @return {*}  {T}
   */
  public static _new_model_from_state<T extends Model>(
    mid: string,
    map: IStateMap<T>
  ): T {
    var info = map[mid];
    info.buff = new ModelProcessManager._def[info.type]();
    info.buff._set_state(info.data, map);
    return info.buff;
  }

  /**
   * say that something will need a call
   * to ModelProcessManager._sync_processes during the next round
   * @public
   * @return {*}  {ReturnType<typeof setTimeout>}
   */
  public static _need_sync_processes(): ReturnType<typeof setTimeout> {
    if (ModelProcessManager._timeout == null) {
      ModelProcessManager._timeout = setTimeout(
        ModelProcessManager._sync_processes,
        1
      );
      return ModelProcessManager._timeout;
    }
  }

  /**
   * @public
   * @param {typeof Model} model
   * @param {string} [name]
   */
  public static register_models(model: typeof Model, name?: string): void;

  /**
   * @public
   * @param {(typeof Model[]
   *       | {
   *           [key: string]: typeof Model;
   *         })} modelList
   */
  public static register_models(
    modelList:
      | (typeof Model)[]
      | {
          [key: string]: typeof Model;
        }
  ): void;
  public static register_models(
    modelList:
      | typeof Model
      | (typeof Model)[]
      | { [key: string]: typeof Model },
    name?: string
  ): void {
    if (modelList) {
      // function
      if (modelList instanceof Function) {
        ModelProcessManager._register_models_check(modelList, name);
      } else if (isIterable(modelList)) {
        // array
        const l: (typeof Model)[] = <(typeof Model)[]>modelList;
        for (const m of l) {
          ModelProcessManager.register_models(m);
        }
      } else {
        // obj
        const obj: { [key: string]: typeof Model } = <
          { [key: string]: typeof Model }
        >modelList;
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            ModelProcessManager._register_models_check(obj[key], key);
          }
        }
      }
    }
  }

  /**
   * @public
   * @param {typeof Model} func
   * @param {string} [name]
   */
  public static _register_models_check(
    func: typeof Model,
    name?: string
  ): void {
    if (!name)
      name =
        typeof ModelProcessManager._def[name] !== 'undefined'
          ? func._constructorName
          : func.name;
    if (
      typeof ModelProcessManager._def[name] !== 'undefined' &&
      ModelProcessManager._def[name] !== func
    ) {
      console.error(
        `trying to register \"${name}\" Model but was already defined`
      );
      console.error('old =', ModelProcessManager._def[name]);
      console.error('new =', func);
    } else ModelProcessManager._def[name] = func;
    // @ts-ignore
    func._constructorName = name;
  }

  /**
   * the function that is called after a very short timeout,
   * when at least one object has been modified
   * @public
   */
  public static _sync_processes(): void {
    const processes: Map<number, { value: Process; force: boolean }> =
      new Map();
    for (const [, model] of ModelProcessManager._modlist) {
      for (const process of model._processes) {
        processes.set(process.process_id, {
          value: process,
          force: false,
        });
      }
    }
    for (const [id, process] of ModelProcessManager._n_processes) {
      processes.set(id, {
        value: process,
        force: true,
      });
    }
    ModelProcessManager._timeout = undefined;
    ModelProcessManager._modlist.clear();
    ModelProcessManager._n_processes.clear();
    ModelProcessManager._counter += 2;
    for (const [, process] of processes) {
      ModelProcessManager._force_m = process.force;
      process.value.onchange();
    }
    ModelProcessManager._force_m = false;
  }

  public static spinal: SpinalType = {
    version: '2.5.15',
  };
}
