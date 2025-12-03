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
exports.RightsItem = void 0;
var Lst_1 = require("../../Models/Lst");
/**
 * @export
 * @class RightsItem
 * @extends {Lst<T>}
 * @template T
 */
var RightsItem = /** @class */ (function (_super) {
    __extends(RightsItem, _super);
    /**
     * Creates an instance of RightsItem.
     * @memberof RightsItem
     */
    function RightsItem() {
        return _super.call(this) || this;
    }
    /**
     * @static
     * @type {string}
     * @memberof RightsItem
     */
    RightsItem._constructorName = 'RightsItem';
    return RightsItem;
}(Lst_1.Lst));
exports.RightsItem = RightsItem;
//# sourceMappingURL=RightsItem.js.map