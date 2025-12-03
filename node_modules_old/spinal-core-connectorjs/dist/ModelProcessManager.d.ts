import type { ISpinalModel } from './interfaces/ISpinalModels';
import type { IStateMap } from './interfaces/IStateMap';
import type { SpinalType } from './interfaces/SpinalType';
import { Bool } from './Models/Bool';
import { Lst } from './Models/Lst';
import { Model } from './Models/Model';
import { Str } from './Models/Str';
import { Val } from './Models/Val';
import type { Process } from './Processes/Process';
export declare class ModelProcessManager {
    static _counter: number;
    static _modlist: Map<number, Model>;
    static _n_processes: Map<number, Process>;
    static _cur_mid: number;
    static _cur_process_id: number;
    static _timeout: ReturnType<typeof setTimeout>;
    static _force_m: boolean;
    static _def: ISpinalModel;
    static new_from_state(): void;
    static load(): void;
    /**
     * translate a normal javascript to their spinal model connter part
     * @public
     * @param {*} v
     * @return {*}  {Model}
     */
    static conv(v: Model): Model;
    static conv(v: any[]): Lst<any>;
    static conv(v: string): Str;
    static conv(v: number): Val;
    static conv(v: boolean): Bool;
    static conv(v: any): Model;
    /**
     * @public
     * @param {Model} obj
     * @return {*}  {string}
     */
    static get_object_class(obj: Model): string;
    /**
     * @public
     * @param {(Model | object)} m
     * @return {*}  {string[]}
     */
    static _get_attribute_names(m: Model | object): string[];
    /**
     * create a Model using a line of get_state(using.type, .data, ...)
     * @public
     * @template T
     * @param {string} mid
     * @param {IStateMap<T>} map
     * @return {*}  {T}
     */
    static _new_model_from_state<T extends Model>(mid: string, map: IStateMap<T>): T;
    /**
     * say that something will need a call
     * to ModelProcessManager._sync_processes during the next round
     * @public
     * @return {*}  {ReturnType<typeof setTimeout>}
     */
    static _need_sync_processes(): ReturnType<typeof setTimeout>;
    /**
     * @public
     * @param {typeof Model} model
     * @param {string} [name]
     */
    static register_models(model: typeof Model, name?: string): void;
    /**
     * @public
     * @param {(typeof Model[]
     *       | {
     *           [key: string]: typeof Model;
     *         })} modelList
     */
    static register_models(modelList: (typeof Model)[] | {
        [key: string]: typeof Model;
    }): void;
    /**
     * @public
     * @param {typeof Model} func
     * @param {string} [name]
     */
    static _register_models_check(func: typeof Model, name?: string): void;
    /**
     * the function that is called after a very short timeout,
     * when at least one object has been modified
     * @public
     */
    static _sync_processes(): void;
    static spinal: SpinalType;
}
