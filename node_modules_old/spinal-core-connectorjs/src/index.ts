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

import { spinalCore } from './Spinalcore';

export * from './FileSystem/FileSystem';
export * from './FileSystem/Models/Directory';
export * from './FileSystem/Models/File';
export * from './FileSystem/Models/Path';
export * from './FileSystem/Models/Pbr';
export * from './FileSystem/Models/Ptr';
export * from './FileSystem/Models/RightSetList';
export * from './FileSystem/Models/RightsItem';
export * from './FileSystem/Models/SessionModel';
export * from './FileSystem/Models/TiffFile';
export * from './FileSystem/Models/User';
export * from './FileSystem/Models/UserRight';
export * from './interfaces/IAuthResponse';
export * from './interfaces/ICreateSessionResponse';
export * from './interfaces/IFileInfo';
export * from './interfaces/IFileInfoOption';
export * from './interfaces/IFlatModelMap';
export * from './interfaces/IFsData';
export * from './interfaces/INewDomElementParam';
export * from './interfaces/IOptionFilesystem';
export * from './interfaces/ISpinalModels';
export * from './interfaces/IStateMap';
export * from './interfaces/SpinalCallBackError';
export * from './interfaces/SpinalFilterFunction';
export * from './interfaces/SpinalLoadCallBack';
export * from './interfaces/SpinalOnChangeBindModel';
export * from './interfaces/SpinalSortFunction';
export * from './interfaces/SpinalStoreCallBackSucess';
export * from './interfaces/SpinalType';
export * from './ModelProcessManager';
export * from './Models/Bool';
export * from './Models/Choice';
export * from './Models/Lst';
export * from './Models/Model';
export * from './Models/Obj';
export * from './Models/Str';
export * from './Models/TypedArray';
export * from './Models/TypedArray_Float64';
export * from './Models/TypedArray_Int32';
export * from './Models/Val';
export * from './Models/Vec';
export * from './Processes/BindProcess';
export * from './Processes/GlobalBindFunction';
export * from './Processes/Process';
export * from './register';
export * from './Spinalcore';
export * from './SpinalUserManager';
export * from './Utils/DomHelper';
export * from './Utils/getUrlPath';
export * from './Utils/isIterable';
export * from './Utils/sendXhr';

// populate export with spinalCore for
// compatiblity with old lib that use require
for (const key of [
  '_def',
  'version',
  'connect',
  'connectWithSessionId',
  'auth',
  'authOrgan',
  'createSession',
  'store',
  'register_models',
  'loadPromise',
  'load',
  'load_type',
  'load_right',
  'load_directory',
  'load_ptr',
  'share_model',
  'right_flag',
  'extend',
  'defaultCallbackError',
]) {
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      // @ts-ignore
      return spinalCore[key];
    },
  });
}
