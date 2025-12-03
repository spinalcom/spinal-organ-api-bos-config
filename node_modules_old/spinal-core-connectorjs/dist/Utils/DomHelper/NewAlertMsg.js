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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.NewAlertMsg = void 0;
var loadingGif_1 = require("./loadingGif");
var newDomElement_1 = require("./newDomElement");
/**
 * make msg popup
 * @export
 * @class NewAlertMsg
 */
var NewAlertMsg = /** @class */ (function () {
    function NewAlertMsg(params) {
        if (params === void 0) { params = {}; }
        this.params = params;
        this.hideBtn = this.hide_btn.bind(this);
        this.showBtn = this.show_btn.bind(this);
        this.createBackground();
        this.createPopup();
        this.createContent();
        this.createFooter();
    }
    NewAlertMsg.prototype.hide_btn = function () {
        this.footer.style.display = 'none';
        this.img.style.display = 'inline';
    };
    NewAlertMsg.prototype.show_btn = function () {
        this.footer.style.display = 'block';
        this.img.style.display = 'none';
    };
    NewAlertMsg.prototype.hide = function () {
        this.background.style.display = 'none';
    };
    NewAlertMsg.prototype.show = function () {
        this.background.style.display = 'block';
    };
    NewAlertMsg.prototype.setMsg = function (msg) {
        this.msg.innerHTML = msg;
    };
    NewAlertMsg.prototype.createBackground = function () {
        var _this = this;
        this.background = (0, newDomElement_1.newDomElement)({
            nodeName: 'div',
            style: {
                position: 'fixed',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(36, 42, 48, 0.38)',
                zIndex: 100000,
                textAlign: 'center'
            },
            onclick: function (evt) {
                if (evt.target != _this.background)
                    return;
                if (evt.target !== _this.background) {
                    return;
                }
                if (typeof _this.params.onclose === 'function')
                    _this.params.onclose();
                // this.hide();
                if (typeof evt.stopPropagation === 'function')
                    evt.stopPropagation();
                if (typeof evt.preventDefault === 'function')
                    evt.preventDefault();
                if (typeof evt.stopImmediatePropagation === 'function')
                    evt.stopImmediatePropagation();
                return false;
            }
        });
        if (this.params.parent != null) {
            this.params.parent.appendChild(this.background);
        }
    };
    NewAlertMsg.prototype.createPopup = function () {
        this.popup = (0, newDomElement_1.newDomElement)({
            nodeName: 'div',
            style: {
                marginTop: '30px',
                display: 'inline-block',
                width: '80%',
                backgroundColor: '#FFF',
                zIndex: 100001,
                borderRadius: '30px'
            }
        });
        this.background.appendChild(this.popup);
    };
    NewAlertMsg.prototype.createContent = function () {
        var content = (0, newDomElement_1.newDomElement)({
            style: {
                width: '100%',
                color: '#000',
                position: 'relative',
                padding: '15px',
                fontSize: 'xx-large'
            }
        });
        this.popup.appendChild(content);
        this.img = (0, newDomElement_1.newDomElement)({
            nodeName: 'img',
            src: loadingGif_1.loadingGif,
            style: {
                height: '35px',
                marginRight: '20px'
            }
        });
        content.appendChild(this.img);
        this.msg = (0, newDomElement_1.newDomElement)({
            nodeName: 'span'
        });
        content.appendChild(this.msg);
    };
    NewAlertMsg.prototype.createFooter = function () {
        var e_1, _a;
        this.footer = (0, newDomElement_1.newDomElement)({
            style: {
                width: '100%',
                color: '#000',
                position: 'relative',
                padding: '15px',
                height: '100px'
            }
        });
        this.popup.appendChild(this.footer);
        try {
            for (var _b = __values(this.params.btn), _c = _b.next(); !_c.done; _c = _b.next()) {
                var btn = _c.value;
                var d = (0, newDomElement_1.newDomElement)({
                    style: {
                        width: "".concat(100 / this.params.btn.length, "%"),
                        paddingRight: '5px',
                        paddingLeft: '5px',
                        float: 'left'
                    }
                });
                var b = (0, newDomElement_1.newDomElement)({
                    nodeName: 'button',
                    innerHTML: btn.txt,
                    onclick: btn.click,
                    style: {
                        display: 'inline-block',
                        padding: '6px 12px',
                        marginBottom: '0',
                        fontSize: 'x-large',
                        fontWeight: '400',
                        height: '70px',
                        lineHeight: '1.42857143',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                        touchAction: 'manipulation',
                        cursor: 'pointer',
                        userSelect: 'none',
                        border: '1px solid transparent',
                        borderRadius: '4px',
                        width: '100%',
                        backgroundColor: btn.backgroundColor,
                        color: '#fff'
                    }
                });
                this.footer.appendChild(d);
                d.appendChild(b);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    NewAlertMsg._constructorName = 'NewAlertMsg';
    return NewAlertMsg;
}());
exports.NewAlertMsg = NewAlertMsg;
// export type NewAlertMsgType = typeof NewAlertMsg;
var NewAlertMsgType = NewAlertMsg;
globalThis.NewAlertMsg = NewAlertMsg;
globalThis.new_alert_msg = NewAlertMsg;
//# sourceMappingURL=NewAlertMsg.js.map