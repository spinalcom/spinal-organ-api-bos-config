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
import type { SpinalFilterFunction } from '../interfaces/SpinalFilterFunction';
import type { SpinalSortFunction } from '../interfaces/SpinalSortFunction';
import { ModelProcessManager } from '../ModelProcessManager';
import { Model } from './Model';

/**
 * Bese representation of an Array
 * @export
 * @class Lst
 * @extends {Model}
 * @template T
 */
export class Lst<T extends Model = any> extends Model {
  /**
   * @static
   * @type {string}
   * @memberof Lst
   */
  public static _constructorName: string = 'Lst';

  /**
   * @type {number}
   * @memberof Lst
   */
  public length: number = 0;

  /**
   * Creates an instance of Lst.
   * @param {*} [data]
   * @memberof Lst
   */
  public constructor(data?: any) {
    super();
    const s = this.static_length();
    if (s >= 0) {
      const d = this.default_value();
      for (let i = 0; i <= s; i++) {
        this.push(d, true);
      }
    }
    if (data) this._set(data);
  }

  /**
   * @return {*}  {number}
   * @memberof Lst
   */
  public static_length(): number {
    return -1;
  }

  /**
   * @protected
   * @return {*}  {number}
   * @memberof Lst
   */
  protected default_value(): number {
    return 0;
  }

  /**
   * @protected
   * @return {*}  {*}
   * @memberof Lst
   */
  protected base_type(): any {
    return undefined;
  }

  /**
   * @return {*}  {ReturnType<T['get']>[]}
   * @memberof Lst
   */
  public get(): ReturnType<T['get']>[] {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      if (this[i]) res.push(this[i].get());
    }
    return res;
  }

  /**
   * @return {*}  {[number]}
   * @memberof Lst
   */
  public size(): [number] {
    return [this.length];
  }

  /**
   * @return {*}  {string}
   * @memberof Lst
   */
  public toString(): string {
    let res = [];

    for (let i = 0; i < this.length; i++) {
      res.push(this[i].toString());
    }
    if (res.length > 0) return res.join();
    return '';
  }

  /**
   * @param {Lst<T>} lst
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public equals(lst: Lst<T>): boolean {
    if (lst.length !== this.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (!this[i].equals(lst[i])) return false;
    }
    return true;
  }

  /**
   * @param {*} value
   * @param {boolean} [force=false]
   * @return {*}  {void}
   * @memberof Lst
   */
  public push(value: any, force: boolean = false): void {
    if (this._static_size_check(force)) return;
    let b = this.base_type();
    if (b) {
      if (!(value instanceof b)) value = new b(value);
    } else {
      value = ModelProcessManager.conv(value);
    }

    if (value._parents.indexOf(this) === -1) {
      value._parents.push(this);
    }

    this[this.length++] = value;
    this._signal_change();
  }

  /**
   * @return {*}  {T}
   * @memberof Lst
   */
  public pop(): T {
    if (this._static_size_check(false)) return;
    if (this.length <= 0) return;
    const res = this[--this.length];
    this.rem_attr(this.length.toString(10));
    return res;
  }

  /**
   * @memberof Lst
   */
  public clear(): void {
    while (this.length) {
      this.pop();
    }
  }

  /**
   * @param {*} value
   * @return {*}  {number}
   * @memberof Lst
   */
  public unshift(value: any): number {
    if (this._static_size_check(false)) {
      return;
    }
    const b = this.base_type();
    if (b != null) {
      if (!(value instanceof b)) value = new b(value);
    } else value = ModelProcessManager.conv(value);

    if (value._parents.indexOf(this) < 0) value._parents.push(this);

    if (this.length) {
      for (let i = this.length - 1; i >= 0; i--) {
        this[i + 1] = this[i];
      }
    }
    this[0] = value;
    this.length += 1;
    this._signal_change();
    return this.length;
  }

  /**
   * @return {*}  {T}
   * @memberof Lst
   */
  public shift(): T {
    const res = this[0];
    this.slice(0, 1);
    return res;
  }

  /**
   * @param {T} item
   * @memberof Lst
   */
  public remove(item: T | ReturnType<T['get']>): void {
    const index = this.indexOf(item);
    if (index >= 0) this.splice(index, 1);
  }

  /**
   * @param {T} item
   * @memberof Lst
   */
  public remove_ref(item: T | ReturnType<T['get']>): void {
    const index = this.indexOf_ref(item);
    if (index >= 0) this.splice(index, 1);
  }

  /**
   * @param {SpinalFilterFunction<T>} f
   * @return {*}  {T[]}
   * @memberof Lst
   */
  public filter(f: SpinalFilterFunction<T>): T[] {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      if (f(this[i])) res.push(this[i]);
    }
    return res;
  }

  /**
   * @param {SpinalFilterFunction<T>} f
   * @return {*}  {T}
   * @memberof Lst
   */
  public detect(f: SpinalFilterFunction<T>): T {
    for (let i = 0; i < this.length; i++) {
      if (f(this[i])) return this[i];
    }
    return undefined;
  }

  /**
   * @param {SpinalSortFunction<T>} sort
   * @return {*}  {Array<T>}
   * @memberof Lst
   */
  public sorted(sort: SpinalSortFunction<T>): Array<T> {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      res.push(this[i]);
    }
    return res.sort(sort);
  }

  /**
   * @param {SpinalFilterFunction<T>} f
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public has(f: SpinalFilterFunction<T>): boolean {
    for (let i = 0; i < this.length; i++) {
      if (f(this[i])) return true;
    }
    return false;
  }

  /**
   * @param {T} value
   * @return {*}  {(number | -1)} -1 if not found
   * @memberof Lst
   */
  public indexOf(value: T | ReturnType<T['get']>): number | -1 {
    for (let i = 0; i < this.length; i++) {
      if (this[i].equals(value)) return i;
    }
    return -1;
  }

  /**
   * @param {T} value
   * @return {*}  {number}
   * @memberof Lst
   */
  public indexOf_ref(value: T | ReturnType<T['get']>): number {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == value) return i;
    }
    return -1;
  }

  /**
   * @param {T} value
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public contains(value: T | ReturnType<T['get']>): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * @param {T} value
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public contains_ref(value: T | ReturnType<T['get']>): boolean {
    return this.indexOf_ref(value) !== -1;
  }

  /**
   * @param {T} value
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public toggle(value: T | ReturnType<T['get']>): boolean {
    const index = this.indexOf(value);
    if (index !== -1) {
      this.splice(index);
      return false;
    } else {
      this.push(value);
      return true;
    }
  }

  /**
   * @param {T} value
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public toggle_ref(value: T | ReturnType<T['get']>): boolean {
    const index = this.indexOf_ref(value);
    if (index !== -1) {
      this.splice(index);
      return false;
    } else {
      this.push(value);
      return true;
    }
  }

  /**
   * @param {number} begin
   * @param {number} [end=this.length]
   * @return {*}  {Lst<T>}
   * @memberof Lst
   */
  public slice(begin: number, end: number = this.length): Lst<T> {
    const res = new Lst<T>();

    if (begin < 0) begin = 0;
    if (end > this.length) end = this.length;
    for (let i = begin; i < end; i++) {
      res.push(this[i].get());
    }
    return res;
  }

  /**
   * @param {Lst<T>} new_tab
   * @param {boolean} [force=false]
   * @return {*}  {void}
   * @memberof Lst
   */
  public concat(new_tab: any, force: boolean = false): void {
    if (this._static_size_check(force)) return;

    if (new_tab.length) {
      for (let i = 0; i < new_tab.length; i++) {
        this.push(new_tab[i]);
      }
    }
  }

  /**
   * @param {number} index
   * @param {number} [n=1]
   * @return {*}  {void}
   * @memberof Lst
   */
  public splice(index: number, n: number = 1): void {
    if (this._static_size_check(false)) return;
    const end = Math.min(index + n, this.length);
    for (let i = index; i < end; i++) this.rem_attr(i.toString(10));
    for (let i = index; i < this.length - n; i++) this[i] = this[i + n];
    for (let i = this.length - n; i < this.length; i++) delete this[i];
    this.length -= n;
    this._signal_change();
  }

  /**
   * @param {number} index
   * @param {(Lst<T> | T[] | Lst<any> | any[])} lst
   * @memberof Lst
   */
  public insert(
    index: number,
    lst: Lst<T> | T[] | ReturnType<T['get']>[]
  ): void {
    const end = Math.max(this.length - index, 0);
    const res = [];
    for (let i = 0; i < end; i++) {
      res.push(this.pop());
    }
    res.reverse();
    for (let i = 0; i < lst.length; i++) {
      // @ts-ignore
      this.push(lst[i]);
    }
    for (let i = 0; i < res.length; i++) {
      this.push(res[i]);
    }
  }

  /**
   * @param {number} index
   * @param {T} val
   * @return {*}  {void}
   * @memberof Lst
   */
  public set_or_push(index: number, val: T | ReturnType<T['get']>): void {
    if (index < this.length) {
      return this.mod_attr(index.toString(), val);
    }
    if (index === this.length) {
      this.push(val);
    }
  }

  /**
   * @param {number} size
   * @memberof Lst
   */
  public trim(size: number): void {
    while (this.length > size) this.pop();
  }

  /**
   * @param {string} sep
   * @return {*}  {string}
   * @memberof Lst
   */
  public join(sep: string): string {
    return this.get().join(sep);
  }

  /**
   * @return {*}  {Lst<T>}
   * @memberof Lst
   */
  public deep_copy(): Lst<T> {
    const res: Lst<T> = new Lst();
    for (let i = 0; i < this.length; i++) res.push(this[i].deep_copy());
    return res;
  }

  /**
   * @return {*}  {T}
   * @memberof Lst
   */
  public back(): T {
    return this[this.length - 1];
  }

  /**
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public real_change(): boolean {
    if (this.has_been_directly_modified()) return true;
    for (let i = 0; i < this.length; i++) {
      if (this[i].real_change()) return true;
    }
    return false;
  }

  /**
   * @protected
   * @param {Lst<T>} value
   * @return {*}  {boolean}
   * @memberof Lst
   */
  protected _set(value: Lst<T> | ReturnType<T['get']>[] | T[]): boolean {
    let change = Number(this.length != value.length);
    const s = this.static_length();

    if (s >= 0 && change) {
      console.error(
        `resizing a static array (type ${ModelProcessManager.get_object_class(
          this
        )}) is forbidden`
      );
    }

    for (let i = 0; i < value.length; i++) {
      // @ts-ignore
      if (i < this.length) change |= this[i].set(value[i]);
      else if (s < 0) {
        // @ts-ignore
        this.push(value[i]);
      }
    }
    if (s < 0) {
      while (this.length > value.length) {
        this.pop();
      }
      this.length = value.length;
    }
    return Boolean(change);
  }

  /**
   * @protected
   * @param {IFlatModelMap} map
   * @param {number} date
   * @return {*}  {IFlatModelMap}
   * @memberof Lst
   */
  protected _get_flat_model_map(
    map: IFlatModelMap,
    date: number
  ): IFlatModelMap {
    map[this.model_id] = this;
    for (let i = 0; i < this.length; i++) {
      if (!map.hasOwnProperty(this[i]))
        if (this[i]._date_last_modification > date)
          this[i]._get_flat_model_map(map, date);
    }
    return map;
  }

  /**
   * @param {IFsData} out
   * @memberof Lst
   */
  public _get_fs_data(out: IFsData): void {
    FileSystem.set_server_id_if_necessary(out, this);
    const res = [];
    for (let i = 0; i < this.length; i++) {
      const obj = this[i];
      FileSystem.set_server_id_if_necessary(out, obj);
      res.push(obj._server_id);
    }
    out.mod += `C ${this._server_id} ${res.join(',')} `;
  }

  /**
   * @protected
   * @return {*}  {string}
   * @memberof Lst
   */
  protected _get_state(): string {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      res.push(this[i].model_id);
    }
    return res.join(',');
  }

  /**
   * @param {string} str
   * @param {IStateMap<T>} map
   * @memberof Lst
   */
  public _set_state(str: string, map: IStateMap<T>): void {
    const l_id = str.split(',').filter((x) => {
      return x.length;
    });
    while (this.length > l_id.length) this.pop();

    for (let i = 0; i < this.length; i++) {
      const k_id = l_id[i];

      if (map[k_id].buff) {
        if (map[k_id].buff != this[i])
          this.mod_attr(i.toString(10), map[k_id].buff);
      } else if (!this[i]._set_state_if_same_type(k_id, map)) {
        this.mod_attr(
          i.toString(10),
          ModelProcessManager._new_model_from_state(k_id, map)
        );
      }
    }

    for (let i = this.length; i < l_id.length; i++) {
      const k_id = l_id[i];
      if (map[k_id].hasOwnProperty('buff') && map[k_id].buff !== null)
        this.push(map[k_id].buff);
      else this.push(ModelProcessManager._new_model_from_state(k_id, map));
    }
  }

  /**
   * @param {boolean} force
   * @return {*}  {boolean}
   * @memberof Lst
   */
  public _static_size_check(force: boolean): boolean {
    if (this.static_length() >= 0 && !force) {
      console.error(
        `resizing a static array (type ` +
          `${ModelProcessManager.get_object_class(this)}) is forbidden`
      );
      return true;
    }
    return false;
  }

  /**
   * @return {*}  {Generator<T, void, unknown>}
   * @memberof Lst
   */
  public *[Symbol.iterator](): Generator<T, void, unknown> {
    for (let i = 0; i < this.length; i++) {
      yield <T>this[i];
    }
  }
}

type LstAlias<T extends Model = any> = Lst<T>;
declare global {
  export namespace spinal {
    export type Lst<T extends Model = any> = LstAlias<T>;
  }
}
