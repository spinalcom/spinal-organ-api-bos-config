import { Model } from 'spinal-core-connectorjs_type';
interface ForgeFileDerivativesItemParams {
    [key: string]: any;
    name?: string;
    path?: string;
}
declare class ForgeFileDerivativesItem extends Model {
    name: spinal.Str;
    path: spinal.Str;
    constructor(params?: ForgeFileDerivativesItemParams);
}
declare class ForgeFileItem extends Model {
    _name: spinal.Str;
    _viewable: spinal.Bool;
    _children: spinal.Lst<ForgeFileDerivativesItem>;
    name: spinal.Str;
    filepath: spinal.Path;
    state: spinal.Choice;
    urn: spinal.Str;
    ask_token: spinal.Bool;
    oauth: spinal.Str;
    bucket_key: spinal.Str;
    constructor(name?: string);
    add_child(child: ForgeFileDerivativesItem): void;
    accept_child(ch: any): boolean;
}
export default ForgeFileItem;
export { ForgeFileItem, ForgeFileDerivativesItem, };
