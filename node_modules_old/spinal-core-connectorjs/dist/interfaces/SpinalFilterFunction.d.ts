import type { Model } from '../Models/Model';
export declare type SpinalFilterFunction<T extends Model = Model> = (item: T) => boolean;
