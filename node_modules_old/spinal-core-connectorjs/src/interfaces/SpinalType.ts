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

import type { FileSystem } from '../FileSystem/FileSystem';
import type { Directory } from '../FileSystem/Models/Directory';
import type { File } from '../FileSystem/Models/File';
import type { Path } from '../FileSystem/Models/Path';
import type { Pbr } from '../FileSystem/Models/Pbr';
import type { Ptr } from '../FileSystem/Models/Ptr';
import type { RightSetList } from '../FileSystem/Models/RightSetList';
import type { RightsItem } from '../FileSystem/Models/RightsItem';
import type { SessionModel } from '../FileSystem/Models/SessionModel';
import type { TiffFile } from '../FileSystem/Models/TiffFile';
import type { User } from '../FileSystem/Models/User';
import type { UserRight } from '../FileSystem/Models/UserRight';
import type { ModelProcessManager } from '../ModelProcessManager';
import type { Bool } from '../Models/Bool';
import type { Choice } from '../Models/Choice';
import type { Lst } from '../Models/Lst';
import type { Model } from '../Models/Model';
import type { Obj } from '../Models/Obj';
import type { Str } from '../Models/Str';
import type { TypedArray } from '../Models/TypedArray';
import type { TypedArray_Float64 } from '../Models/TypedArray_Float64';
import type { TypedArray_Int32 } from '../Models/TypedArray_Int32';
import type { Val } from '../Models/Val';
import type { Vec } from '../Models/Vec';
import type { BindProcess } from '../Processes/BindProcess';
import type { Process } from '../Processes/Process';
import type { spinalCore } from '../Spinalcore';
import type { SpinalUserManager } from '../SpinalUserManager';

export type SpinalType = Partial<{
  version: string;
  spinalCore: typeof spinalCore;
  FileSystem: typeof FileSystem;
  ModelProcessManager: typeof ModelProcessManager;
  SpinalUserManager: typeof SpinalUserManager;
  Process: typeof Process;
  BindProcess: typeof BindProcess;
  Model: typeof Model;
  Obj: typeof Obj;
  Bool: typeof Bool;
  Val: typeof Val;
  Str: typeof Str;
  Lst: typeof Lst;
  Vec: typeof Vec;
  Choice: typeof Choice;
  TypedArray: typeof TypedArray;
  TypedArray_Int32: typeof TypedArray_Int32;
  TypedArray_Float64: typeof TypedArray_Float64;
  Directory: typeof Directory;
  File: typeof File;
  TiffFile: typeof TiffFile;
  Path: typeof Path;
  Ptr: typeof Ptr;
  Pbr: typeof Pbr;
  SessionModel: typeof SessionModel;
  User: typeof User;
  UserRight: typeof UserRight;
  RightSetList: typeof RightSetList;
  RightsItem: typeof RightsItem;
  [key: string]: any;
}>;
