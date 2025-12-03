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

import type { INewDomElementParam } from '../../interfaces/INewDomElementParam';

/**
 * create a new dom element
 * nodeName to specify kind (div by default)
 * parentNode to specify a parent
 * style { ... }
 * txt for a text node as a child
 * other paramers are used to set directly set attributes
 * @export
 * @param {INewDomElementParam} [params={}]
 * @param {string} [nodeName='div']
 * @return {*}  {HTMLElement}
 */
export function newDomElement(
  params: INewDomElementParam = {},
  nodeName: string = 'div'
): HTMLElement {
  const n = document.createElement(params.nodeName || nodeName);
  for (const name in params) {
    const val = params[name];
    switch (name) {
      case 'parentNode':
        val.appendChild(n);
        break;
      case 'nodeName':
        break;
      case 'style':
        for (const k in val) {
          // @ts-ignore
          n.style[k] = <number | string>val[k];
        }
        break;
      case 'txt':
        n.innerHTML = val;
        break;
      default:
        // @ts-ignore
        n[name] = val;
    }
  }
  return n;
}

declare global {
  function new_dom_element(
    params?: INewDomElementParam,
    nodeName?: string
  ): HTMLElement;
  function newDomElement(
    params?: INewDomElementParam,
    nodeName?: string
  ): HTMLElement;
}
globalThis.new_dom_element = newDomElement;
globalThis.newDomElement = newDomElement;
