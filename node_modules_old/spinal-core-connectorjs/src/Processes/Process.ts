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

import { ModelProcessManager } from '../ModelProcessManager';
import { Model } from '../Models/Model';
import { isIterable } from '../Utils/isIterable';

export class Process {
  public static _constructorName: string = 'Process';
  public process_id: number;
  public _models: Model[] = []; // what this is observing

  public constructor(
    m: Model | Model[],
    onchange_construction: boolean = true
  ) {
    this.process_id = ModelProcessManager._cur_process_id;
    ModelProcessManager._cur_process_id += 1;

    if (m instanceof Model) {
      m.bind(this, onchange_construction);
    } else if (isIterable(m)) {
      for (const model of m) {
        model.bind(this, onchange_construction);
      }
    } else if (m != null) {
      console.error("Process constructor doesn't know what to do with", m);
    }
  }

  public destructor() {
    for (const model of this._models) {
      const idx = model._processes.indexOf(this);
      if (idx >= 0) model._processes.splice(idx, 1);
    }
  }

  /**
   * called if at least one of the corresponding models has changed
   * in the previous round
   * @memberof Process
   */
  public onchange(): void {}
}
