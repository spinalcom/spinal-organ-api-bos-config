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

import type { Model } from '../../Models/Model';
import { Ptr } from './Ptr';

/**
 * @export
 * @class Pbr
 * @extends {Ptr<T>}
 * @template T
 */
export class Pbr<T extends Model = any> extends Ptr<T> {
  /**
   * @static
   * @type {string}
   * @memberof Pbr
   */
  public static _constructorName: string = 'Pbr';

  /**
   * Creates an instance of Pbr.
   * @param {*} [model]
   * @memberof Pbr
   */
  public constructor(model?: any) {
    super(model);
  }
}

type _Pbr<T extends Model = any> = Pbr<T>;
declare global {
  export namespace spinal {
    export type Pbr<T extends Model = any> = _Pbr<T>;
  }
}
