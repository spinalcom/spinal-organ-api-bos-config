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
exports.Process = void 0;
var ModelProcessManager_1 = require("../ModelProcessManager");
var Model_1 = require("../Models/Model");
var isIterable_1 = require("../Utils/isIterable");
var Process = /** @class */ (function () {
    function Process(m, onchange_construction) {
        var e_1, _a;
        if (onchange_construction === void 0) { onchange_construction = true; }
        this._models = []; // what this is observing
        this.process_id = ModelProcessManager_1.ModelProcessManager._cur_process_id;
        ModelProcessManager_1.ModelProcessManager._cur_process_id += 1;
        if (m instanceof Model_1.Model) {
            m.bind(this, onchange_construction);
        }
        else if ((0, isIterable_1.isIterable)(m)) {
            try {
                for (var m_1 = __values(m), m_1_1 = m_1.next(); !m_1_1.done; m_1_1 = m_1.next()) {
                    var model = m_1_1.value;
                    model.bind(this, onchange_construction);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (m_1_1 && !m_1_1.done && (_a = m_1["return"])) _a.call(m_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if (m != null) {
            console.error("Process constructor doesn't know what to do with", m);
        }
    }
    Process.prototype.destructor = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this._models), _c = _b.next(); !_c.done; _c = _b.next()) {
                var model = _c.value;
                var idx = model._processes.indexOf(this);
                if (idx >= 0)
                    model._processes.splice(idx, 1);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * called if at least one of the corresponding models has changed
     * in the previous round
     * @memberof Process
     */
    Process.prototype.onchange = function () { };
    Process._constructorName = 'Process';
    return Process;
}());
exports.Process = Process;
//# sourceMappingURL=Process.js.map