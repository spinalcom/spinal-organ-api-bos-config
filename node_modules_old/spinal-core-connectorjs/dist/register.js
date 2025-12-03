"use strict";
exports.__esModule = true;
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
var FileSystem_1 = require("./FileSystem/FileSystem");
var Directory_1 = require("./FileSystem/Models/Directory");
var File_1 = require("./FileSystem/Models/File");
var Path_1 = require("./FileSystem/Models/Path");
var Pbr_1 = require("./FileSystem/Models/Pbr");
var Ptr_1 = require("./FileSystem/Models/Ptr");
var RightSetList_1 = require("./FileSystem/Models/RightSetList");
var RightsItem_1 = require("./FileSystem/Models/RightsItem");
var SessionModel_1 = require("./FileSystem/Models/SessionModel");
var TiffFile_1 = require("./FileSystem/Models/TiffFile");
var User_1 = require("./FileSystem/Models/User");
var UserRight_1 = require("./FileSystem/Models/UserRight");
var ModelProcessManager_1 = require("./ModelProcessManager");
var Bool_1 = require("./Models/Bool");
var Choice_1 = require("./Models/Choice");
var Lst_1 = require("./Models/Lst");
var Model_1 = require("./Models/Model");
var Obj_1 = require("./Models/Obj");
var Str_1 = require("./Models/Str");
var TypedArray_Float64_1 = require("./Models/TypedArray_Float64");
var TypedArray_Int32_1 = require("./Models/TypedArray_Int32");
var Val_1 = require("./Models/Val");
var Vec_1 = require("./Models/Vec");
var BindProcess_1 = require("./Processes/BindProcess");
var Process_1 = require("./Processes/Process");
var Spinalcore_1 = require("./Spinalcore");
var SpinalUserManager_1 = require("./SpinalUserManager");
if (!('spinal' in globalThis)) {
    globalThis.spinal = ModelProcessManager_1.ModelProcessManager.spinal;
}
globalThis.spinalCore = Spinalcore_1.spinalCore;
ModelProcessManager_1.ModelProcessManager.spinal.spinalCore = Spinalcore_1.spinalCore;
globalThis.FileSystem = FileSystem_1.FileSystem;
ModelProcessManager_1.ModelProcessManager.spinal.FileSystem = FileSystem_1.FileSystem;
globalThis.ModelProcessManager = ModelProcessManager_1.ModelProcessManager;
ModelProcessManager_1.ModelProcessManager.spinal.ModelProcessManager = ModelProcessManager_1.ModelProcessManager;
globalThis.SpinalUserManager = SpinalUserManager_1.SpinalUserManager;
ModelProcessManager_1.ModelProcessManager.spinal.SpinalUserManager = SpinalUserManager_1.SpinalUserManager;
globalThis.Process = Process_1.Process;
ModelProcessManager_1.ModelProcessManager.spinal.Process = Process_1.Process;
// @ts-ignore
ModelProcessManager_1.ModelProcessManager.register_models(Process_1.Process, 'Process');
globalThis.BindProcess = BindProcess_1.BindProcess;
ModelProcessManager_1.ModelProcessManager.spinal.BindProcess = BindProcess_1.BindProcess;
// @ts-ignore
ModelProcessManager_1.ModelProcessManager.register_models(BindProcess_1.BindProcess, 'BindProcess');
globalThis.Model = Model_1.Model;
ModelProcessManager_1.ModelProcessManager.spinal.Model = Model_1.Model;
ModelProcessManager_1.ModelProcessManager.register_models(Model_1.Model, 'Model');
globalThis.Obj = Obj_1.Obj;
ModelProcessManager_1.ModelProcessManager.spinal.Obj = Obj_1.Obj;
ModelProcessManager_1.ModelProcessManager.register_models(Obj_1.Obj, 'Obj');
globalThis.Bool = Bool_1.Bool;
ModelProcessManager_1.ModelProcessManager.spinal.Bool = Bool_1.Bool;
ModelProcessManager_1.ModelProcessManager.register_models(Bool_1.Bool, 'Bool');
globalThis.Val = Val_1.Val;
ModelProcessManager_1.ModelProcessManager.spinal.Val = Val_1.Val;
ModelProcessManager_1.ModelProcessManager.register_models(Val_1.Val, 'Val');
globalThis.Str = Str_1.Str;
ModelProcessManager_1.ModelProcessManager.spinal.Str = Str_1.Str;
ModelProcessManager_1.ModelProcessManager.register_models(Str_1.Str, 'Str');
globalThis.Lst = Lst_1.Lst;
ModelProcessManager_1.ModelProcessManager.spinal.Lst = Lst_1.Lst;
ModelProcessManager_1.ModelProcessManager.register_models(Lst_1.Lst, 'Lst');
globalThis.Vec = Vec_1.Vec;
ModelProcessManager_1.ModelProcessManager.spinal.Vec = Vec_1.Vec;
ModelProcessManager_1.ModelProcessManager.register_models(Vec_1.Vec, 'Vec');
globalThis.Choice = Choice_1.Choice;
ModelProcessManager_1.ModelProcessManager.spinal.Choice = Choice_1.Choice;
ModelProcessManager_1.ModelProcessManager.register_models(Choice_1.Choice, 'Choice');
globalThis.TypedArray_Int32 = TypedArray_Int32_1.TypedArray_Int32;
ModelProcessManager_1.ModelProcessManager.spinal.TypedArray_Int32 = TypedArray_Int32_1.TypedArray_Int32;
ModelProcessManager_1.ModelProcessManager.register_models(TypedArray_Int32_1.TypedArray_Int32, 'TypedArray_Int32');
globalThis.TypedArray_Float64 = TypedArray_Float64_1.TypedArray_Float64;
ModelProcessManager_1.ModelProcessManager.spinal.TypedArray_Float64 = TypedArray_Float64_1.TypedArray_Float64;
ModelProcessManager_1.ModelProcessManager.register_models(TypedArray_Float64_1.TypedArray_Float64, 'TypedArray_Float64');
globalThis.Directory = Directory_1.Directory;
ModelProcessManager_1.ModelProcessManager.spinal.Directory = Directory_1.Directory;
ModelProcessManager_1.ModelProcessManager.register_models(Directory_1.Directory, 'Directory');
globalThis.File = File_1.File;
ModelProcessManager_1.ModelProcessManager.spinal.File = File_1.File;
ModelProcessManager_1.ModelProcessManager.register_models(File_1.File, 'File');
globalThis.TiffFile = TiffFile_1.TiffFile;
ModelProcessManager_1.ModelProcessManager.spinal.TiffFile = TiffFile_1.TiffFile;
ModelProcessManager_1.ModelProcessManager.register_models(TiffFile_1.TiffFile, 'TiffFile');
globalThis.Path = Path_1.Path;
ModelProcessManager_1.ModelProcessManager.spinal.Path = Path_1.Path;
ModelProcessManager_1.ModelProcessManager.register_models(Path_1.Path, 'Path');
globalThis.Ptr = Ptr_1.Ptr;
ModelProcessManager_1.ModelProcessManager.spinal.Ptr = Ptr_1.Ptr;
ModelProcessManager_1.ModelProcessManager.register_models(Ptr_1.Ptr, 'Ptr');
globalThis.Pbr = Pbr_1.Pbr;
ModelProcessManager_1.ModelProcessManager.spinal.Pbr = Pbr_1.Pbr;
ModelProcessManager_1.ModelProcessManager.register_models(Pbr_1.Pbr, 'Pbr');
globalThis.SessionModel = SessionModel_1.SessionModel;
ModelProcessManager_1.ModelProcessManager.spinal.SessionModel = SessionModel_1.SessionModel;
ModelProcessManager_1.ModelProcessManager.register_models(SessionModel_1.SessionModel, 'SessionModel');
globalThis.User = User_1.User;
ModelProcessManager_1.ModelProcessManager.spinal.User = User_1.User;
ModelProcessManager_1.ModelProcessManager.register_models(User_1.User, 'User');
globalThis.UserRight = UserRight_1.UserRight;
ModelProcessManager_1.ModelProcessManager.spinal.UserRight = UserRight_1.UserRight;
ModelProcessManager_1.ModelProcessManager.register_models(UserRight_1.UserRight, 'UserRight');
globalThis.RightSetList = RightSetList_1.RightSetList;
ModelProcessManager_1.ModelProcessManager.spinal.RightSetList = RightSetList_1.RightSetList;
ModelProcessManager_1.ModelProcessManager.register_models(RightSetList_1.RightSetList, 'RightSetList');
globalThis.RightsItem = RightsItem_1.RightsItem;
ModelProcessManager_1.ModelProcessManager.spinal.RightsItem = RightsItem_1.RightsItem;
ModelProcessManager_1.ModelProcessManager.register_models(RightsItem_1.RightsItem, 'RightsItem');
var _ModelProcessManager = ModelProcessManager_1.ModelProcessManager;
//# sourceMappingURL=register.js.map