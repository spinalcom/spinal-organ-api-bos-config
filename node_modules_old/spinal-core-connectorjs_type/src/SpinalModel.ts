/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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

export * from 'spinal-core-connectorjs';
const spinalCore = require('spinal-core-connectorjs');
import type { spinalCore as _spinalCore } from 'spinal-core-connectorjs';
export default <typeof _spinalCore>spinalCore;

// // following is old spinalcorejs compatibility
if (!Object.prototype.hasOwnProperty.call(exports, 'spinalCore')) {
  Object.defineProperty(exports, 'spinalCore', {
    enumerable: true,
    get: function () {
      // @ts-ignore
      return spinalCore;
    },
  });
}
if (!Object.prototype.hasOwnProperty.call(exports, 'FileSystem')) {
  Object.defineProperty(exports, 'FileSystem', {
    enumerable: true,
    get: function () {
      // @ts-ignore
      return FileSystem;
    },
  });
}
if (!Object.prototype.hasOwnProperty.call(exports, 'ModelProcessManager')) {
  Object.defineProperty(exports, 'ModelProcessManager', {
    enumerable: true,
    get: function () {
      // @ts-ignore
      return ModelProcessManager;
    },
  });
}
if (!Object.prototype.hasOwnProperty.call(exports, 'SpinalUserManager')) {
  Object.defineProperty(exports, 'SpinalUserManager', {
    enumerable: true,
    get: function () {
      // @ts-ignore
      return SpinalUserManager;
    },
  });
}
for (const key of [
  'Model',
  'Str',
  'Bool',
  'Val',
  'Lst',
  'Directory',
  'Vec',
  'Path',
  'File',
  'Ptr',
  'Pbr',
  'Choice',
  'TypedArray',
  'TypedArray_Int32',
  'TypedArray_Float64',
  'Process',
  'BindProcess',
]) {
  if (!Object.prototype.hasOwnProperty.call(exports, key)) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        // @ts-ignore
        return _spinalCore._def[key];
      },
    });
  }
}
