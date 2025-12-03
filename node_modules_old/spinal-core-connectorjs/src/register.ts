/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import { FileSystem } from './FileSystem/FileSystem';
import { Directory } from './FileSystem/Models/Directory';
import { File } from './FileSystem/Models/File';
import { Path } from './FileSystem/Models/Path';
import { Pbr } from './FileSystem/Models/Pbr';
import { Ptr } from './FileSystem/Models/Ptr';
import { RightSetList } from './FileSystem/Models/RightSetList';
import { RightsItem } from './FileSystem/Models/RightsItem';
import { SessionModel } from './FileSystem/Models/SessionModel';
import { TiffFile } from './FileSystem/Models/TiffFile';
import { User } from './FileSystem/Models/User';
import { UserRight } from './FileSystem/Models/UserRight';
import type { SpinalType } from './interfaces/SpinalType';
import { ModelProcessManager } from './ModelProcessManager';
import { Bool } from './Models/Bool';
import { Choice } from './Models/Choice';
import { Lst } from './Models/Lst';
import { Model } from './Models/Model';
import { Obj } from './Models/Obj';
import { Str } from './Models/Str';
import { TypedArray_Float64 } from './Models/TypedArray_Float64';
import { TypedArray_Int32 } from './Models/TypedArray_Int32';
import { Val } from './Models/Val';
import { Vec } from './Models/Vec';
import { BindProcess } from './Processes/BindProcess';
import { Process } from './Processes/Process';
import { spinalCore } from './Spinalcore';
import { SpinalUserManager } from './SpinalUserManager';

if (!('spinal' in globalThis)) {
  (<any>globalThis).spinal = ModelProcessManager.spinal;
}

(<any>globalThis).spinalCore = spinalCore;
ModelProcessManager.spinal.spinalCore = spinalCore;
(<any>globalThis).FileSystem = FileSystem;
ModelProcessManager.spinal.FileSystem = FileSystem;
(<any>globalThis).ModelProcessManager = ModelProcessManager;
ModelProcessManager.spinal.ModelProcessManager = ModelProcessManager;
(<any>globalThis).SpinalUserManager = SpinalUserManager;
ModelProcessManager.spinal.SpinalUserManager = SpinalUserManager;
(<any>globalThis).Process = Process;
ModelProcessManager.spinal.Process = Process;
// @ts-ignore
ModelProcessManager.register_models(Process, 'Process');
(<any>globalThis).BindProcess = BindProcess;
ModelProcessManager.spinal.BindProcess = BindProcess;
// @ts-ignore
ModelProcessManager.register_models(BindProcess, 'BindProcess');

(<any>globalThis).Model = Model;
ModelProcessManager.spinal.Model = Model;
ModelProcessManager.register_models(Model, 'Model');
(<any>globalThis).Obj = Obj;
ModelProcessManager.spinal.Obj = Obj;
ModelProcessManager.register_models(Obj, 'Obj');
(<any>globalThis).Bool = Bool;
ModelProcessManager.spinal.Bool = Bool;
ModelProcessManager.register_models(Bool, 'Bool');
(<any>globalThis).Val = Val;
ModelProcessManager.spinal.Val = Val;
ModelProcessManager.register_models(Val, 'Val');
(<any>globalThis).Str = Str;
ModelProcessManager.spinal.Str = Str;
ModelProcessManager.register_models(Str, 'Str');
(<any>globalThis).Lst = Lst;
ModelProcessManager.spinal.Lst = Lst;
ModelProcessManager.register_models(Lst, 'Lst');
(<any>globalThis).Vec = Vec;
ModelProcessManager.spinal.Vec = Vec;
ModelProcessManager.register_models(Vec, 'Vec');
(<any>globalThis).Choice = Choice;
ModelProcessManager.spinal.Choice = Choice;
ModelProcessManager.register_models(Choice, 'Choice');
(<any>globalThis).TypedArray_Int32 = TypedArray_Int32;
ModelProcessManager.spinal.TypedArray_Int32 = TypedArray_Int32;
ModelProcessManager.register_models(TypedArray_Int32, 'TypedArray_Int32');
(<any>globalThis).TypedArray_Float64 = TypedArray_Float64;
ModelProcessManager.spinal.TypedArray_Float64 = TypedArray_Float64;
ModelProcessManager.register_models(TypedArray_Float64, 'TypedArray_Float64');
(<any>globalThis).Directory = Directory;
ModelProcessManager.spinal.Directory = Directory;
ModelProcessManager.register_models(Directory, 'Directory');
(<any>globalThis).File = File;
ModelProcessManager.spinal.File = File;
ModelProcessManager.register_models(File, 'File');
(<any>globalThis).TiffFile = TiffFile;
ModelProcessManager.spinal.TiffFile = TiffFile;
ModelProcessManager.register_models(TiffFile, 'TiffFile');
(<any>globalThis).Path = Path;
ModelProcessManager.spinal.Path = Path;
ModelProcessManager.register_models(Path, 'Path');
(<any>globalThis).Ptr = Ptr;
ModelProcessManager.spinal.Ptr = Ptr;
ModelProcessManager.register_models(Ptr, 'Ptr');
(<any>globalThis).Pbr = Pbr;
ModelProcessManager.spinal.Pbr = Pbr;
ModelProcessManager.register_models(Pbr, 'Pbr');
(<any>globalThis).SessionModel = SessionModel;
ModelProcessManager.spinal.SessionModel = SessionModel;
ModelProcessManager.register_models(SessionModel, 'SessionModel');
(<any>globalThis).User = User;
ModelProcessManager.spinal.User = User;
ModelProcessManager.register_models(User, 'User');
(<any>globalThis).UserRight = UserRight;
ModelProcessManager.spinal.UserRight = UserRight;
ModelProcessManager.register_models(UserRight, 'UserRight');
(<any>globalThis).RightSetList = RightSetList;
ModelProcessManager.spinal.RightSetList = RightSetList;
ModelProcessManager.register_models(RightSetList, 'RightSetList');
(<any>globalThis).RightsItem = RightsItem;
ModelProcessManager.spinal.RightsItem = RightsItem;
ModelProcessManager.register_models(RightsItem, 'RightsItem');
var _ModelProcessManager = ModelProcessManager;

declare global {
  var spinal: SpinalType;
  export namespace spinal {
    export type spinalCore = InstanceType<
      typeof _ModelProcessManager.spinal.spinalCore
    >;
    export type FileSystem = InstanceType<
      typeof _ModelProcessManager.spinal.FileSystem
    >;
    export type ModelProcessManager = InstanceType<
      typeof _ModelProcessManager.spinal.ModelProcessManager
    >;
    export type SpinalUserManager = InstanceType<
      typeof _ModelProcessManager.spinal.SpinalUserManager
    >;
    export type Process = InstanceType<
      typeof _ModelProcessManager.spinal.Process
    >;
    export type BindProcess = InstanceType<
      typeof _ModelProcessManager.spinal.BindProcess
    >;
    // export type Model = InstanceType<typeof _ModelProcessManager.spinal.Model>;
    export type Obj = InstanceType<typeof _ModelProcessManager.spinal.Obj>;
    export type Bool = InstanceType<typeof _ModelProcessManager.spinal.Bool>;
    export type Val = InstanceType<typeof _ModelProcessManager.spinal.Val>;
    export type Str = InstanceType<typeof _ModelProcessManager.spinal.Str>;
    export type Vec = InstanceType<typeof _ModelProcessManager.spinal.Vec>;
    export type Choice = InstanceType<
      typeof _ModelProcessManager.spinal.Choice
    >;
    export type TypedArray_Int32 = InstanceType<
      typeof _ModelProcessManager.spinal.TypedArray_Int32
    >;
    export type TypedArray_Float64 = InstanceType<
      typeof _ModelProcessManager.spinal.TypedArray_Float64
    >;
    export type Path = InstanceType<typeof _ModelProcessManager.spinal.Path>;
    export type SessionModel = InstanceType<
      typeof _ModelProcessManager.spinal.SessionModel
    >;
    export type User = InstanceType<typeof _ModelProcessManager.spinal.User>;
    export type UserRight = InstanceType<
      typeof _ModelProcessManager.spinal.UserRight
    >;
    export type RightSetList = InstanceType<
      typeof _ModelProcessManager.spinal.RightSetList
    >;
    export type RightsItem = InstanceType<
      typeof _ModelProcessManager.spinal.RightsItem
    >;
  }
}
