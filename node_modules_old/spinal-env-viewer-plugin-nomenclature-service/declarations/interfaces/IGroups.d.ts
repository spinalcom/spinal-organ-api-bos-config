import { SpinalNode } from "spinal-env-viewer-graph-service";
export interface IGroups {
    id: string;
    name: string;
    type: string;
    groups: SpinalNode<any>[];
}
