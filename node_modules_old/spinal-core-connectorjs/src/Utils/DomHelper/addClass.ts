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

/**
 * obj is a DOM object. src is a string or an array of
 * string containing one or several classNames separated with spaces
 * @export
 * @param {HTMLElement} obj
 * @param {(string | string[])} src
 * @return {*}  {void}
 */
export function addClass(obj: HTMLElement, src: string | string[]): void {
  if (typeof src === 'string') return addClass(obj, src.split(' '));
  const old = (obj.className || '').split(' ');
  const p_1 = src.filter((x: string): boolean => old.indexOf(x) < 0);

  obj.className = old
    .concat(p_1)
    .filter((x: string): string => x)
    .join(' ');
}
declare global {
  function add_class(obj: HTMLElement, src: string | string[]): void;
  function addClass(obj: HTMLElement, src: string | string[]): void;
}
globalThis.add_class = addClass;
globalThis.addClass = addClass;
