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

import { newDomElement } from './newDomElement';

let _index_current_popup = 10000;

/**
 * @export
 * @interface ISpinalNewPopupParam
 */
export interface ISpinalNewPopupParam {
  popup_closer?: true;
  onclose?: () => void;
  fixed_opacity?: string | number;
  event?: MouseEvent;
  top_x?: number;
  top_y?: number;
  width?: string;
  height?: string;
  child?: HTMLElement;
}

/**
 * make a popup window.
 * returns the creted "inside" div
 * clicking outside closes the window.
 * drag title permits to move he window
 * @export
 * @param {string} title
 * @param {ISpinalNewPopupParam} [params={}]
 * @return {*}  {HTMLElement}
 */
export function spinalNewPopup(
  title: string,
  params: ISpinalNewPopupParam = {}
): HTMLElement {
  let b: HTMLElement;
  let extention = 'px',
    width: string,
    height: string;
  if (params.popup_closer == null) {
    b = newDomElement({
      parentNode: document.body,
      id: 'popup_closer',
      onmousedown: function (_evt: MouseEvent) {
        if (typeof params.onclose === 'function') {
          params.onclose();
        }
        document.body.removeChild(b);
        document.body.removeChild(w);
      },
      ondrop: function (evt: Event) {
        if (!evt) {
          evt = window.event;
        }
        evt.cancelBubble = true;
        if (typeof evt.stopPropagation === 'function') {
          evt.stopPropagation();
        }
        if (typeof evt.preventDefault === 'function') {
          evt.preventDefault();
        }
        if (typeof evt.stopImmediatePropagation === 'function') {
          evt.stopImmediatePropagation();
        }
        return false;
      },
      style: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: params.fixed_opacity || '#000',
        opacity: params.fixed_opacity || 0,
        zIndex: _index_current_popup,
      },
    });
  }

  const clientX =
    params.event != null && params.event.clientX
      ? params.event.clientX
      : window.innerWidth / 2 - 10;
  const clientY =
    params.event != null && params.event.clientY
      ? params.event.clientY
      : window.innerHeight / 2 - 10;
  let top_x = params.top_x || -1000;
  let top_y = params.top_y || -1000;
  let old_x = 0;
  let old_y = 0;
  if (params.width != null) {
    width = params.width;
  }
  if (params.height != null) {
    height = params.height;
  }
  function repos(): void {
    top_x = clientX - w.clientWidth / 2;
    top_y = clientY - w.clientHeight / 2;
    if (top_x + w.clientWidth > window.innerWidth) {
      top_x = window.innerWidth - w.clientWidth - 50;
    }
    if (top_y + w.clientHeight > window.innerHeight) {
      top_y = window.innerHeight - w.clientHeight + 50;
    }
    if (top_x < 50) {
      top_x = 50;
    }
    if (top_y < 50) {
      top_y = 50;
    }
    w.style.left = top_x.toString(10);
    w.style.top = top_y.toString(10);
  }

  function _drag_evt_func(evt: MouseEvent): void {
    top_x += evt.clientX - old_x;
    top_y += evt.clientY - old_y;
    w.style.left = top_x.toString(10);
    w.style.top = top_y.toString(10);
    old_x = evt.clientX;
    old_y = evt.clientY;
    return typeof evt.preventDefault === 'function'
      ? evt.preventDefault()
      : void 0;
  }
  function _drag_end_func(): void {
    if (typeof (<any>document).detachEvent === 'function') {
      // for old browser
      (<any>document).detachEvent('onmousemove', _drag_evt_func);
      (<any>document).detachEvent('onmouseup', _drag_end_func);
    }
    if (typeof document.removeEventListener === 'function') {
      document.removeEventListener('mousemove', _drag_evt_func, true);
      document.removeEventListener('mouseup', _drag_end_func, true);
    }
  }
  if (!params.top_x) {
    setTimeout(repos, 5);
    extention = '%';
  }
  const w = newDomElement({
    parentNode: document.body,
    className: 'Popup',
    style: {
      position: 'absolute',
      left: top_x,
      top: top_y,
      width: width + extention,
      height: height + extention,
      zIndex: _index_current_popup + 1,
      border: 'thin solid black',
      background: '#e5e5e5',
      resize: 'both',
      overflow: 'auto',
      paddingBottom: '8px',
    },
  });
  _index_current_popup += 2;
  newDomElement({
    parentNode: w,
    className: 'PopupClose',
    txt: 'Close',
    style: {
      float: 'right',
      marginRight: '4px',
      marginTop: '4px',
      cursor: 'pointer',
    },
    onmousedown: function (evt: MouseEvent): void {
      if (typeof params.onclose === 'function') {
        params.onclose();
      }
      if (b != null) {
        document.body.removeChild(b);
      }
      document.body.removeChild(w);
    },
  });
  if (title) {
    newDomElement({
      parentNode: w,
      className: 'PopupTitle',
      innerHTML: title,
      style: {
        background: '#262626',
        padding: '5 10 3 10',
        height: '22px',
        fontSize: '12px',
        borderBottom: 'thin solid black',
        cursor: 'pointer',
        color: 'white',
      },
      onmousedown: function (evt: MouseEvent): void {
        old_x = evt.clientX;
        old_y = evt.clientY;
        top_x = parseInt(w.style.left);
        top_y = parseInt(w.style.top);
        document.addEventListener('mousemove', _drag_evt_func, true);
        document.addEventListener('mouseup', _drag_end_func, true);
        return typeof evt.preventDefault === 'function'
          ? evt.preventDefault()
          : void 0;
      },
    });
  }
  const res = newDomElement({
    parentNode: w,
    className: 'PopupWindow',
    style: {
      padding: '6px',
      height: '100%',
      color: '#262626',
    },
  });
  if (params.child != null) {
    res.appendChild(params.child);
  }
  return res;
}

declare global {
  function spinalNewPopup(
    title: string,
    params?: ISpinalNewPopupParam
  ): HTMLElement;
  function spinal_new_popup(
    title: string,
    params?: ISpinalNewPopupParam
  ): HTMLElement;
}
globalThis.spinal_new_popup = spinalNewPopup;
globalThis.spinalNewPopup = spinalNewPopup;
