import { Model } from 'spinal-core-connectorjs_type';
export declare class SpinalAttribute extends Model {
    label: spinal.Str;
    value: spinal.Str | spinal.Val | spinal.Bool;
    date: spinal.Val;
    type: spinal.Str;
    unit: spinal.Str;
    constructor(label: string, value: any, type?: string, unit?: string);
}
