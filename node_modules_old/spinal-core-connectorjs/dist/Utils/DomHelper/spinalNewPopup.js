"use strict";
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
exports.__esModule = true;
exports.spinalNewPopup = void 0;
var newDomElement_1 = require("./newDomElement");
var _index_current_popup = 10000;
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
function spinalNewPopup(title, params) {
    if (params === void 0) { params = {}; }
    var b;
    var extention = 'px', width, height;
    if (params.popup_closer == null) {
        b = (0, newDomElement_1.newDomElement)({
            parentNode: document.body,
            id: 'popup_closer',
            onmousedown: function (_evt) {
                if (typeof params.onclose === 'function') {
                    params.onclose();
                }
                document.body.removeChild(b);
                document.body.removeChild(w);
            },
            ondrop: function (evt) {
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
                zIndex: _index_current_popup
            }
        });
    }
    var clientX = params.event != null && params.event.clientX
        ? params.event.clientX
        : window.innerWidth / 2 - 10;
    var clientY = params.event != null && params.event.clientY
        ? params.event.clientY
        : window.innerHeight / 2 - 10;
    var top_x = params.top_x || -1000;
    var top_y = params.top_y || -1000;
    var old_x = 0;
    var old_y = 0;
    if (params.width != null) {
        width = params.width;
    }
    if (params.height != null) {
        height = params.height;
    }
    function repos() {
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
    function _drag_evt_func(evt) {
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
    function _drag_end_func() {
        if (typeof document.detachEvent === 'function') {
            // for old browser
            document.detachEvent('onmousemove', _drag_evt_func);
            document.detachEvent('onmouseup', _drag_end_func);
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
    var w = (0, newDomElement_1.newDomElement)({
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
            paddingBottom: '8px'
        }
    });
    _index_current_popup += 2;
    (0, newDomElement_1.newDomElement)({
        parentNode: w,
        className: 'PopupClose',
        txt: 'Close',
        style: {
            float: 'right',
            marginRight: '4px',
            marginTop: '4px',
            cursor: 'pointer'
        },
        onmousedown: function (evt) {
            if (typeof params.onclose === 'function') {
                params.onclose();
            }
            if (b != null) {
                document.body.removeChild(b);
            }
            document.body.removeChild(w);
        }
    });
    if (title) {
        (0, newDomElement_1.newDomElement)({
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
                color: 'white'
            },
            onmousedown: function (evt) {
                old_x = evt.clientX;
                old_y = evt.clientY;
                top_x = parseInt(w.style.left);
                top_y = parseInt(w.style.top);
                document.addEventListener('mousemove', _drag_evt_func, true);
                document.addEventListener('mouseup', _drag_end_func, true);
                return typeof evt.preventDefault === 'function'
                    ? evt.preventDefault()
                    : void 0;
            }
        });
    }
    var res = (0, newDomElement_1.newDomElement)({
        parentNode: w,
        className: 'PopupWindow',
        style: {
            padding: '6px',
            height: '100%',
            color: '#262626'
        }
    });
    if (params.child != null) {
        res.appendChild(params.child);
    }
    return res;
}
exports.spinalNewPopup = spinalNewPopup;
globalThis.spinal_new_popup = spinalNewPopup;
globalThis.spinalNewPopup = spinalNewPopup;
//# sourceMappingURL=spinalNewPopup.js.map