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

import { Model } from '../Models/Model';
import type { Process } from './Process';

export function bind(
  model: Model | Model[],
  func: Process | (() => void),
  onchange_construction: boolean = true
): Process {
  if (model instanceof Model) {
    model.bind(func, onchange_construction);
  } else {
    for (const m of model) {
      return m.bind(func, onchange_construction);
    }
  }
}

declare global {
  function bind(
    model: Model | Model[],
    func: Process | (() => void),
    onchange_construction: boolean
  ): Process;
}

globalThis.bind = bind;
