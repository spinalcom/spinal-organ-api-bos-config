import type { SpinalType } from './interfaces/SpinalType';
import { ModelProcessManager } from './ModelProcessManager';
declare var _ModelProcessManager: typeof ModelProcessManager;
declare global {
    var spinal: SpinalType;
    export namespace spinal {
        type spinalCore = InstanceType<typeof _ModelProcessManager.spinal.spinalCore>;
        type FileSystem = InstanceType<typeof _ModelProcessManager.spinal.FileSystem>;
        type ModelProcessManager = InstanceType<typeof _ModelProcessManager.spinal.ModelProcessManager>;
        type SpinalUserManager = InstanceType<typeof _ModelProcessManager.spinal.SpinalUserManager>;
        type Process = InstanceType<typeof _ModelProcessManager.spinal.Process>;
        type BindProcess = InstanceType<typeof _ModelProcessManager.spinal.BindProcess>;
        type Obj = InstanceType<typeof _ModelProcessManager.spinal.Obj>;
        type Bool = InstanceType<typeof _ModelProcessManager.spinal.Bool>;
        type Val = InstanceType<typeof _ModelProcessManager.spinal.Val>;
        type Str = InstanceType<typeof _ModelProcessManager.spinal.Str>;
        type Vec = InstanceType<typeof _ModelProcessManager.spinal.Vec>;
        type Choice = InstanceType<typeof _ModelProcessManager.spinal.Choice>;
        type TypedArray_Int32 = InstanceType<typeof _ModelProcessManager.spinal.TypedArray_Int32>;
        type TypedArray_Float64 = InstanceType<typeof _ModelProcessManager.spinal.TypedArray_Float64>;
        type Path = InstanceType<typeof _ModelProcessManager.spinal.Path>;
        type SessionModel = InstanceType<typeof _ModelProcessManager.spinal.SessionModel>;
        type User = InstanceType<typeof _ModelProcessManager.spinal.User>;
        type UserRight = InstanceType<typeof _ModelProcessManager.spinal.UserRight>;
        type RightSetList = InstanceType<typeof _ModelProcessManager.spinal.RightSetList>;
        type RightsItem = InstanceType<typeof _ModelProcessManager.spinal.RightsItem>;
    }
}
export {};
