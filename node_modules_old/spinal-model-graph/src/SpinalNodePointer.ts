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
import {
  FileSystem,
  Model,
  Pbr,
  Ptr,
  spinalCore,
  Str,
} from 'spinal-core-connectorjs';
import type { SpinalNodePointerInfoModel } from './interfaces/SpinalNodePointerInfoModel';
import { SpinalNode } from './Nodes/SpinalNode';
import { BaseSpinalRelation } from './Relations/BaseSpinalRelation';

/**
 * Wrapper over SpinalNodePointer containing some information about the pointed element
 * @class SpinalNodePointer
 * @extends {Model}
 * @template T extends Model
 */
class SpinalNodePointer<T extends Model = any> extends Model {
  public ptr: Ptr<T>;
  public info: SpinalNodePointerInfoModel;

  /**
   * Constructor for the SpinalNodePointer class.
   * @param {T} element Element to wich the SpinalNodePointer will point
   * @param blockRights determine if the pointer is a pbr
   * @memberof SpinalNodePointer
   */
  constructor(element: T, blockRights: boolean = false) {
    super();
    if (FileSystem._sig_server === false) return;

    this.add_attr({
      ptr: blockRights ? new Pbr() : new Ptr(),
      info: {},
    });

    this.setElement(element);
  }

  /**
   * Sets pointer to point to an element.
   * @param {T} element Element to point to
   * @throws {TypeError} If the element is not a Model
   * @memberof SpinalNodePointer
   */
  setElement(element: T): void {
    if (!(element instanceof Model)) {
      throw TypeError('The pointed value must be a Model');
    }
    if (
      element instanceof SpinalNode ||
      element instanceof BaseSpinalRelation
    ) {
      this.info.mod_attr('pointedId', element.getId());
      this.info.mod_attr('pointedType', element.getType());
    }
    this.ptr.set(element);
  }

  /**
   * Loads the model to which the pointer is pointing.
   * @returns {Promise<T>} The model to which the pointer is pointing
   * @memberof SpinalNodePointer
   */
  load(): Promise<T> {
    return new Promise((resolve: (value: T | PromiseLike<T>) => void): void => {
      if (this.ptr) {
        if (this.ptr.data.model) return resolve(this.ptr.data.model);
        if (this.ptr.data.value) {
          if (typeof FileSystem._objects[this.ptr.data.value] !== 'undefined') {
            return resolve(<T>FileSystem._objects[this.ptr.data.value]);
          }
          if (
            typeof FileSystem._tmp_objects[this.ptr.data.value] !== 'undefined'
          ) {
            return resolve(<T>FileSystem._tmp_objects[this.ptr.data.value]);
          }
        }
      }
      this.ptr.load(resolve);
    });
  }

  /**
   * Unsets the pointer. The pointer shouldn't be used after that.
   * @memberof SpinalNodePointer
   */
  unset(): void {
    this.info.rem_attr('pointedId');
    this.info.rem_attr('pointedType');
    this.ptr.set(0);
  }

  /**
   * Returns the id of the pointed element.
   * @returns {Str}  Id of the pointed element
   * @memberof SpinalNodePointer
   */
  getId(): Str {
    return this.info.pointedId;
  }

  /**
   * This function returns the type of the pointed element.
   * @returns {Str} Type of the pointed element
   * @memberof SpinalNodePointer
   */
  getType(): Str {
    return this.info.pointedType;
  }
}

spinalCore.register_models([SpinalNodePointer]);
export default SpinalNodePointer;
export { SpinalNodePointer };
