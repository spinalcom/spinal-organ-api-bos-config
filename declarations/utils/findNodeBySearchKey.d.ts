import type { SpinalNode } from 'spinal-model-graph';
export declare const searchByName: readonly ["name"];
export declare const searchById: readonly ["id"];
export declare const searchByNameOrId: readonly ["id", "name"];
export type TAppSearch = typeof searchByName | typeof searchById | typeof searchByNameOrId;
export declare function isNodeMatchSearchKey(searchKeys: TAppSearch, searchValue: string, node: SpinalNode): boolean;
export declare function findNodeBySearchKey(nodes: SpinalNode[], searchKeys: TAppSearch, searchValue: string): SpinalNode;
