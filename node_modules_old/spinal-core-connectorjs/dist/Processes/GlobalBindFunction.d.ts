import { Model } from '../Models/Model';
import type { Process } from './Process';
export declare function bind(model: Model | Model[], func: Process | (() => void), onchange_construction?: boolean): Process;
declare global {
    function bind(model: Model | Model[], func: Process | (() => void), onchange_construction: boolean): Process;
}
