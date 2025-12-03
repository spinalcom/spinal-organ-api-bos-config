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

import { Choice, Model, Path, spinalCore } from 'spinal-core-connectorjs_type';
interface ForgeFileDerivativesItemParams {
  [key: string]: any;
  name?: string;
  path?: string;
}

class ForgeFileDerivativesItem extends Model {
  name: spinal.Str;
  path: spinal.Str;
  constructor(params?: ForgeFileDerivativesItemParams) {
    super();
    let param: any;
    param = params;
    if (!params) {
      param = {};
    }
    if ((params != null ? param.name : void 0) == null) {
      param.name = 'unnamed';
    }
    if ((param != null ? param.path : void 0) == null) {
      param.path = '.';
    }
    this.add_attr({ name: param.name, path: param.path });
    this._name = this.name;
  }
}

class ForgeFileItem extends Model {
  // tslint:disable-next-line:variable-name
  _name: spinal.Str;
  // tslint:disable-next-line:variable-name
  _viewable: spinal.Bool;
  // tslint:disable-next-line:variable-name
  _children: spinal.Lst<ForgeFileDerivativesItem>;
  name: spinal.Str;
  filepath: spinal.Path;
  state: spinal.Choice;
  urn: spinal.Str;
  // tslint:disable-next-line:variable-name
  ask_token: spinal.Bool;
  oauth: spinal.Str;
  // tslint:disable-next-line:variable-name
  bucket_key: spinal.Str;

  constructor(name: string = 'Forge File') {
    super();
    const tmp = {
      name,
      _name: name,
      _viewable: false,
      _children: [],
      filepath: new Path(),
      state: new Choice(0, [
        'Initial',
        'Uploading',
        'Uploading completed',
        'Uploading to forge',
        'Upload to forge completed',
        'Translating',
        'Translating completed',
        'Export completed',
        'Failed',
      ]),
      urn: '',
      ask_token: false,
      oauth: '',
      bucket_key: '',
    };
    this.add_attr(tmp);
  }
  add_child(child: ForgeFileDerivativesItem): void {
    this._children.push(child);
  }
  accept_child(ch: any): boolean {
    return ch instanceof ForgeFileDerivativesItem;
  }
}

spinalCore.register_models([ForgeFileItem, ForgeFileDerivativesItem]);
export default ForgeFileItem;

export {
  ForgeFileItem,
  ForgeFileDerivativesItem,
};
