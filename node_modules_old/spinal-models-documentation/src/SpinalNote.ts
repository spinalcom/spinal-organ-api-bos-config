/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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

import { spinalCore, Model, Ptr } from 'spinal-core-connectorjs_type';
import { MESSAGE_TYPES } from './constants';

export interface ViewStateInterface {
  viewState: string;
  objectState: string;
  [key: string]: any;
}

export interface ViewStateInterfaceModel extends spinal.Model {
  viewState: spinal.Str;
  objectState: spinal.Str;
  [key: string]: any;
}

export class SpinalNote extends Model {
  username: spinal.Str;
  date: spinal.Str;
  message: spinal.Str;
  userId: spinal.Str;
  type: spinal.Str;
  file: spinal.Ptr<spinal.File<spinal.Path>>;
  viewPoint: ViewStateInterfaceModel;

  constructor(
    username: string,
    message: string,
    userId: string,
    type: string = MESSAGE_TYPES.text,
    file?: any,
    viewPoint?: ViewStateInterface
  ) {
    super();
    this.add_attr({
      username: username,
      date: Date.now(),
      message: message,
      userId: userId,
      type: type,
      file: file ? new Ptr(file) : undefined,
      viewPoint: viewPoint ? viewPoint : undefined,
    });
  }
}

spinalCore.register_models(SpinalNote);
