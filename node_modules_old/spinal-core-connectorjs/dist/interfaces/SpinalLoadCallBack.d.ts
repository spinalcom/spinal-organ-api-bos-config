import type { Model } from '../Models/Model';
export declare type SpinalLoadCallBack<T extends Model = Model> = (model: T, error?: boolean | string) => void;
