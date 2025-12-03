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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
exports.ModelProcessManager = void 0;
var Bool_1 = require("./Models/Bool");
var Lst_1 = require("./Models/Lst");
var Model_1 = require("./Models/Model");
var Str_1 = require("./Models/Str");
var Val_1 = require("./Models/Val");
var isIterable_1 = require("./Utils/isIterable");
var ModelProcessManager = /** @class */ (function () {
    function ModelProcessManager() {
    }
    ModelProcessManager.new_from_state = function () {
        throw 'function obsolete';
    };
    ModelProcessManager.load = function () {
        throw 'function obsolete';
    };
    ModelProcessManager.conv = function (v) {
        if (v instanceof Model_1.Model)
            return v;
        if (v instanceof Array)
            return new Lst_1.Lst(v);
        if (typeof v === 'string')
            return new Str_1.Str(v);
        if (typeof v === 'number')
            return new Val_1.Val(v);
        if (typeof v === 'boolean')
            return new Bool_1.Bool(v);
        return new Model_1.Model(v);
    };
    /**
     * @public
     * @param {Model} obj
     * @return {*}  {string}
     */
    ModelProcessManager.get_object_class = function (obj) {
        if (obj === null || obj === void 0 ? void 0 : obj.constructor) {
            if ('_constructorName' in obj.constructor)
                // @ts-ignore
                return obj.constructor._constructorName;
            if ('name' in obj.constructor)
                return obj.constructor.name;
            if ('toString' in obj.constructor) {
                var arr = obj.constructor.toString().match(/class\s*(\w+)/);
                if (!arr) {
                    arr = obj.constructor.toString().match(/function\s*(\w+)/);
                }
                if ((arr === null || arr === void 0 ? void 0 : arr.length) === 2) {
                    return arr[1];
                }
            }
        }
    };
    /**
     * @public
     * @param {(Model | object)} m
     * @return {*}  {string[]}
     */
    ModelProcessManager._get_attribute_names = function (m) {
        if (m instanceof Model_1.Model) {
            return m._attribute_names;
        }
        var res = [];
        for (var key in m) {
            if (Object.prototype.hasOwnProperty.call(m, key)) {
                res.push(key);
            }
        }
        return res;
    };
    /**
     * create a Model using a line of get_state(using.type, .data, ...)
     * @public
     * @template T
     * @param {string} mid
     * @param {IStateMap<T>} map
     * @return {*}  {T}
     */
    ModelProcessManager._new_model_from_state = function (mid, map) {
        var info = map[mid];
        info.buff = new ModelProcessManager._def[info.type]();
        info.buff._set_state(info.data, map);
        return info.buff;
    };
    /**
     * say that something will need a call
     * to ModelProcessManager._sync_processes during the next round
     * @public
     * @return {*}  {ReturnType<typeof setTimeout>}
     */
    ModelProcessManager._need_sync_processes = function () {
        if (ModelProcessManager._timeout == null) {
            ModelProcessManager._timeout = setTimeout(ModelProcessManager._sync_processes, 1);
            return ModelProcessManager._timeout;
        }
    };
    ModelProcessManager.register_models = function (modelList, name) {
        var e_1, _a;
        if (modelList) {
            // function
            if (modelList instanceof Function) {
                ModelProcessManager._register_models_check(modelList, name);
            }
            else if ((0, isIterable_1.isIterable)(modelList)) {
                // array
                var l = modelList;
                try {
                    for (var l_1 = __values(l), l_1_1 = l_1.next(); !l_1_1.done; l_1_1 = l_1.next()) {
                        var m = l_1_1.value;
                        ModelProcessManager.register_models(m);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (l_1_1 && !l_1_1.done && (_a = l_1["return"])) _a.call(l_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                // obj
                var obj = modelList;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        ModelProcessManager._register_models_check(obj[key], key);
                    }
                }
            }
        }
    };
    /**
     * @public
     * @param {typeof Model} func
     * @param {string} [name]
     */
    ModelProcessManager._register_models_check = function (func, name) {
        if (!name)
            name =
                typeof ModelProcessManager._def[name] !== 'undefined'
                    ? func._constructorName
                    : func.name;
        if (typeof ModelProcessManager._def[name] !== 'undefined' &&
            ModelProcessManager._def[name] !== func) {
            console.error("trying to register \"".concat(name, "\" Model but was already defined"));
            console.error('old =', ModelProcessManager._def[name]);
            console.error('new =', func);
        }
        else
            ModelProcessManager._def[name] = func;
        // @ts-ignore
        func._constructorName = name;
    };
    /**
     * the function that is called after a very short timeout,
     * when at least one object has been modified
     * @public
     */
    ModelProcessManager._sync_processes = function () {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        var processes = new Map();
        try {
            for (var _e = __values(ModelProcessManager._modlist), _f = _e.next(); !_f.done; _f = _e.next()) {
                var _g = __read(_f.value, 2), model = _g[1];
                try {
                    for (var _h = (e_3 = void 0, __values(model._processes)), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var process_1 = _j.value;
                        processes.set(process_1.process_id, {
                            value: process_1,
                            force: false
                        });
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_b = _h["return"])) _b.call(_h);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e["return"])) _a.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _k = __values(ModelProcessManager._n_processes), _l = _k.next(); !_l.done; _l = _k.next()) {
                var _m = __read(_l.value, 2), id = _m[0], process_2 = _m[1];
                processes.set(id, {
                    value: process_2,
                    force: true
                });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_l && !_l.done && (_c = _k["return"])) _c.call(_k);
            }
            finally { if (e_4) throw e_4.error; }
        }
        ModelProcessManager._timeout = undefined;
        ModelProcessManager._modlist.clear();
        ModelProcessManager._n_processes.clear();
        ModelProcessManager._counter += 2;
        try {
            for (var processes_1 = __values(processes), processes_1_1 = processes_1.next(); !processes_1_1.done; processes_1_1 = processes_1.next()) {
                var _o = __read(processes_1_1.value, 2), process_3 = _o[1];
                ModelProcessManager._force_m = process_3.force;
                process_3.value.onchange();
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (processes_1_1 && !processes_1_1.done && (_d = processes_1["return"])) _d.call(processes_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        ModelProcessManager._force_m = false;
    };
    // nb "change rounds" since the beginning ( * 2 to differenciate direct and indirect changes )
    ModelProcessManager._counter = 0;
    // changed models (current round)
    ModelProcessManager._modlist = new Map();
    // new processes (that will need a first onchange call in "force" mode)
    ModelProcessManager._n_processes = new Map();
    // current model id (used to create new ids)
    ModelProcessManager._cur_mid = 0;
    // current process id (used to create new ids)
    ModelProcessManager._cur_process_id = 0;
    // timer used to create a new "round"
    ModelProcessManager._timeout = undefined;
    // if _force_m == true, every has_been_modified function will return true
    ModelProcessManager._force_m = false;
    ModelProcessManager._def = {};
    ModelProcessManager.spinal = {
        version: '2.5.15'
    };
    return ModelProcessManager;
}());
exports.ModelProcessManager = ModelProcessManager;
//# sourceMappingURL=ModelProcessManager.js.map