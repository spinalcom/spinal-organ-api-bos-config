import type { Model } from '../Models/Model';
import { Process } from './Process';
export declare class BindProcess extends Process {
    static _constructorName: string;
    f: () => void;
    constructor(model: Model | Model[], onchange_construction: boolean, f: () => void);
    onchange(): void;
}
