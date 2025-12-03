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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Choice = void 0;
var Model_1 = require("./Model");
/**
 * @export
 * @class Choice
 * @extends {Model}
 */
var Choice = /** @class */ (function (_super) {
    __extends(Choice, _super);
    /**
     * Creates an instance of Choice.
     * @param {(Val | number)} [InitIdx]
     * @param {((string | Str)[])} [stringChoises]
     * @memberof Choice
     */
    function Choice(InitIdx, stringChoises) {
        var _this = _super.call(this) || this;
        // default
        _this.add_attr({
            num: 0,
            lst: stringChoises
        });
        // init
        if (InitIdx != null) {
            _this.num.set(InitIdx);
        }
        return _this;
    }
    /**
     * @return {*}  {boolean}
     * @memberof Choice
     */
    Choice.prototype.filter = function () {
        return true;
    };
    /**
     * @return {*}  {Str} the seleected value
     * @memberof Choice
     */
    Choice.prototype.item = function () {
        return this.lst[this.num.get()];
    };
    /**
     * @return {*}  {string} the seleected value
     * @memberof Choice
     */
    Choice.prototype.get = function () {
        var _a;
        return (_a = this.item()) === null || _a === void 0 ? void 0 : _a.get();
    };
    /**
     * @return {*}  {string}
     * @memberof Choice
     */
    Choice.prototype.toString = function () {
        var _a;
        return (_a = this.item()) === null || _a === void 0 ? void 0 : _a.toString();
    };
    /**
     * @param {(Choice | Str)} a
     * @return {*}  {boolean}
     * @memberof Choice
     */
    Choice.prototype.equals = function (a) {
        if (a instanceof Choice) {
            return _super.prototype.equals.call(this, a);
        }
        else {
            return this.item().equals(a);
        }
    };
    /**
     * @protected
     * @param {(string | number)} value
     * @return {*}  {boolean}
     * @memberof Choice
     */
    Choice.prototype._set = function (value) {
        for (var idx = 0; idx < this.lst.length; idx++) {
            var itm = this.lst[idx];
            if (itm.equals(value)) {
                return this.num.set(idx);
            }
        }
        return this.num.set(value);
    };
    /**
     * @static
     * @type {string}
     * @memberof Choice
     */
    Choice._constructorName = 'Choice';
    return Choice;
}(Model_1.Model));
exports.Choice = Choice;
//# sourceMappingURL=Choice.js.map