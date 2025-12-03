import { Model } from '../Models/Model';
export declare class Process {
    static _constructorName: string;
    process_id: number;
    _models: Model[];
    constructor(m: Model | Model[], onchange_construction?: boolean);
    destructor(): void;
    /**
     * called if at least one of the corresponding models has changed
     * in the previous round
     * @memberof Process
     */
    onchange(): void;
}
