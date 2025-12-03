import type { Val } from 'spinal-core-connectorjs';
import type { SpinalNode, SpinalNodeInfoModel } from 'spinal-model-graph';
export interface ISpinalNodeArchivePart extends SpinalNode {
    info: SpinalNodeInfoModel & {
        start: Val;
        end: Val;
    };
}
