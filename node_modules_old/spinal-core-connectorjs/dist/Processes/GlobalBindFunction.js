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
exports.bind = void 0;
var Model_1 = require("../Models/Model");
function bind(model, func, onchange_construction) {
    var e_1, _a;
    if (onchange_construction === void 0) { onchange_construction = true; }
    if (model instanceof Model_1.Model) {
        model.bind(func, onchange_construction);
    }
    else {
        try {
            for (var model_1 = __values(model), model_1_1 = model_1.next(); !model_1_1.done; model_1_1 = model_1.next()) {
                var m = model_1_1.value;
                return m.bind(func, onchange_construction);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (model_1_1 && !model_1_1.done && (_a = model_1["return"])) _a.call(model_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
exports.bind = bind;
globalThis.bind = bind;
//# sourceMappingURL=GlobalBindFunction.js.map