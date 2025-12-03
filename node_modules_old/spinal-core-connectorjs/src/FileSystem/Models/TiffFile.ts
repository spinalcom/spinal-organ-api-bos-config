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

import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import type { Model } from '../../Models/Model';
import { File } from './File';
import { Ptr } from './Ptr';

/**
 * @export
 * @class TiffFile
 * @extends {File<T>}
 * @template T
 */
export class TiffFile<T extends Model = any> extends File<T> {
  /**
   * @static
   * @type {string}
   * @memberof TiffFile
   */
  public static _constructorName: string = 'TiffFile';

  /**
   * @type {Ptr}
   * @memberof TiffFile
   */
  public _ptr_tiff: Ptr;

  /**
   * @type {number}
   * @memberof TiffFile
   */
  public _has_been_converted: number;

  /**
   * Creates an instance of TiffFile.
   * @param {string} [name='']
   * @param {number} [ptr_or_model=0]
   * @param {number} [ptr_tiff=0]
   * @param {*} [info={}]
   * @memberof TiffFile
   */
  public constructor(
    name: string = '',
    ptr_or_model: number = 0,
    ptr_tiff: number = 0,
    info: any = {}
  ) {
    super(name, ptr_or_model, info);

    this.add_attr({
      _ptr_tiff: new Ptr(ptr_tiff),
      _has_been_converted: 0,
    });
  }

  public load_tiff(callback: SpinalLoadCallBack<T>) {
    this._ptr_tiff.load(callback);
  }
}

type _TiffFile<T extends Model = any> = TiffFile<T>;
declare global {
  export namespace spinal {
    export type TiffFile<T extends Model = any> = _TiffFile<T>;
  }
}
