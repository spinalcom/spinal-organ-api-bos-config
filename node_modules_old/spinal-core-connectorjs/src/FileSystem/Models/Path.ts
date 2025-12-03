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

import type { IFsData } from '../../interfaces/IFsData';
import { Model } from '../../Models/Model';
import type { Val } from '../../Models/Val';
import { FileSystem } from '../FileSystem';

/**
 * representation of a file to upload
 * @export
 * @class Path
 * @extends {Model}
 */
export class Path extends Model {
  /**
   * @static
   * @type {string}
   * @memberof Path
   */
  public static _constructorName: string = 'Path';

  /**
   * @type {(File | Buffer)}
   * @memberof Path
   */
  public file?: File | Buffer;
  /**
   * @type {Val}
   * @memberof Path
   */
  public remaining: Val;
  /**
   * @type {Val}
   * @memberof Path
   */
  public to_upload: Val;

  /**
   * Creates an instance of Path.
   * @param {(File | Buffer)} [file]
   * @memberof Path
   */
  public constructor(file?: File | Buffer) {
    super();
    this.file = file;
    // @ts-ignore
    let size = file?.fileSize;
    if (file && typeof Buffer !== 'undefined' && file instanceof Buffer) {
      size = file.length;
    }
    size = size || 0;

    this.add_attr({
      remaining: size,
      to_upload: size,
    });
  }

  /**
   * @param {{ remaining: Val; to_upload: Val }} info
   * @memberof Path
   */
  public get_file_info(info: { remaining: Val; to_upload: Val }): void {
    info.remaining = this.remaining;
    info.to_upload = this.to_upload;
  }

  /**
   * @param {IFsData} out
   * @memberof Path
   */
  public _get_fs_data(out: IFsData): void {
    super._get_fs_data(out);
    // permit to send the data after the server's answer
    if (this.file != null && this._server_id & 3) {
      FileSystem._files_to_upload[this._server_id] = this;
    }
  }
}
