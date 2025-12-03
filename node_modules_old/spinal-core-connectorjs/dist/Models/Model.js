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
exports.Model = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
var ModelProcessManager_1 = require("../ModelProcessManager");
var BindProcess_1 = require("../Processes/BindProcess");
var Process_1 = require("../Processes/Process");
/**
 * Bese representation of a Object
 * @export
 * @class Model
 */
var Model = /** @class */ (function () {
    /**
     * Creates an instance of Model.
     * @param {*} [attr]
     * @memberof Model
     */
    function Model(attr) {
        /**
         * registered attribute names (in declaration order)
         * @type {string[]}
         * @memberof Model
         */
        this._attribute_names = [];
        /**
         * id of the model
         * @type {number}
         * @memberof Model
         */
        this.model_id = ModelProcessManager_1.ModelProcessManager._cur_mid++;
        /**
         * synchronized processes
         * @type {Process[]}
         * @memberof Model
         */
        this._processes = [];
        /**
         * parent models (depending on this)
         * @type {Model[]}
         * @memberof Model
         */
        this._parents = [];
        /**
         * "date" of previous change. We start at + 2 because
         * we consider that an initialisation is a modification.
         * @type {number}
         * @memberof Model
         */
        this._date_last_modification = ModelProcessManager_1.ModelProcessManager._counter + 2;
        if (attr != null) {
            this._set(attr);
        }
    }
    /**
     * Do nothing here, TBD in child if needed.
     * Called in rem_attr if have no more parent.
     * @memberof Model
     */
    Model.prototype.destructor = function () { };
    /**
     * return true if this (or a child of this) has changed since the previous synchronisation
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.has_been_modified = function () {
        return (this._date_last_modification > ModelProcessManager_1.ModelProcessManager._counter - 2 ||
            ModelProcessManager_1.ModelProcessManager._force_m);
    };
    /**
     * return true if this has changed since previous synchronisation due
     * to a direct modification (not from a child one)
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.has_been_directly_modified = function () {
        return (this._date_last_modification > ModelProcessManager_1.ModelProcessManager._counter - 1 ||
            ModelProcessManager_1.ModelProcessManager._force_m);
    };
    /**
     * if this has been modified during the preceding round, f will be called
     * If f is a process:
     *  process.onchange will be called each time this (or a child of this) will be modified.
     *  process.destructor will be called if this is destroyed.
     *  ...
     *  can be seen as a bind with an object
     * @param {(Process | (() => void))} f
     * @param {boolean} [onchange_construction=true]  true means that onchange will be automatically called after the bind
     * @return {*}  {Process}
     * @memberof Model
     */
    Model.prototype.bind = function (f, onchange_construction) {
        if (f instanceof Process_1.Process) {
            this._processes.push(f);
            f._models.push(this);
            if (onchange_construction) {
                ModelProcessManager_1.ModelProcessManager._n_processes.set(f.process_id, f);
                ModelProcessManager_1.ModelProcessManager._need_sync_processes();
                return f;
            }
        }
        else {
            return new BindProcess_1.BindProcess(this, onchange_construction, f);
        }
    };
    /**
     * @param {(Process | BindProcess | Function)} f recommanded to use Process | BindProcess, using Function can lead to error
     * @memberof Model
     */
    Model.prototype.unbind = function (f) {
        var e_1, _a;
        if (f instanceof Process_1.Process) {
            this._processes.splice(this._processes.indexOf(f), 1);
            f._models.splice(f._models.indexOf(this), 1);
        }
        else {
            try {
                for (var _b = __values(this._processes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var process_1 = _c.value;
                    if (process_1 instanceof BindProcess_1.BindProcess && process_1.f === f)
                        this.unbind(process_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    /**
     * return a copy of data in a "standard" representation (e.g. string, number, objects, ...)
     * users are encouraged to use Models as much as possible
     * (meaning that get should not be called for every manipulation),
     * adding methods for manipulation of data if necessary
     * (e.g. toggle, find, ... in Lst, Str, ...).
     * May be redefined for specific types (e.g. Str, Lst, ...)
     * @return {*}  {*}
     * @memberof Model
     */
    Model.prototype.get = function () {
        var e_2, _a, _b;
        var res = {};
        try {
            for (var _c = __values(this._attribute_names), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_1 = _d.value;
                Object.assign(res, (_b = {}, _b[name_1] = this[name_1].get(), _b));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return res;
    };
    /**
     * modify data, using another values, or Model instances.
     * Should not be redefined (but _set should be)
     * returns true if object os modified
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.set = function (value) {
        if (this._set(value)) {
            // change internal data
            this._signal_change();
            return true;
        }
        return false;
    };
    /**
     * modify state according to str. str can be the result of a previous @get_state
     * @param {string} str
     * @memberof Model
     */
    Model.prototype.set_state = function (str) {
        var e_3, _a;
        var map = {};
        var lst = str.split('\n');
        var mid = lst.shift();
        try {
            for (var lst_1 = __values(lst), lst_1_1 = lst_1.next(); !lst_1_1.done; lst_1_1 = lst_1.next()) {
                var l = lst_1_1.value;
                if (!l.length) {
                    continue;
                }
                var s = l.split(' ');
                map[s[0]] = {
                    type: s[1],
                    data: s[2],
                    buff: void 0
                };
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (lst_1_1 && !lst_1_1.done && (_a = lst_1["return"])) _a.call(lst_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // fill / update this with data in map[ mid ]
        map[mid].buff = this;
        this._set_state(map[mid].data, map);
    };
    /**
     * return a string which describes the changes in this and children since date
     * @param {number} [date=-1]
     * @return {*}  {string}
     * @memberof Model
     */
    Model.prototype.get_state = function (date) {
        if (date === void 0) { date = -1; }
        // get sub models
        var fmm = {};
        this._get_flat_model_map(fmm, date);
        var res = this.model_id.toString();
        if (this._date_last_modification > date) {
            for (var id in fmm) {
                var obj = fmm[id];
                res += "\n".concat(obj.model_id, " ").concat(ModelProcessManager_1.ModelProcessManager.get_object_class(obj), " ").concat(obj._get_state());
            }
        }
        return res;
    };
    /**
     * add attribute (p.values must contain models)
     * can be called with
     *  - name, instance of Model (two arguments)
     *  - { name_1: instance_1, name_2: instance_2, ... } (only one argument)
     * @param {(string | { [nameAttr: string]: any })} name
     * @param {*} [instanceOfModel]
     * @param {boolean} [signal_change=true]
     * @memberof Model
     */
    Model.prototype.add_attr = function (name, instanceOfModel, signal_change) {
        if (signal_change === void 0) { signal_change = true; }
        // name, model
        if (typeof name === 'string' || typeof name === 'number') {
            if (typeof instanceOfModel === 'function') {
                this[name] = instanceOfModel;
            }
            else {
                if (this[name] != null) {
                    console.error("attribute ".concat(name, " already exists in ").concat(ModelProcessManager_1.ModelProcessManager.get_object_class(this)));
                }
                var model = ModelProcessManager_1.ModelProcessManager.conv(instanceOfModel);
                if (model._parents.indexOf(this) < 0) {
                    model._parents.push(this);
                }
                this._attribute_names.push(name);
                this[name] = model;
                if (signal_change) {
                    this._signal_change();
                }
            }
        }
        else {
            // else, asuming { name_1: instance_1, name_2: instance_2, ... }
            for (var key in name) {
                if (Object.prototype.hasOwnProperty.call(name, key)) {
                    var val = name[key];
                    this.add_attr(key, val, signal_change);
                }
            }
        }
    };
    /**
     * remove attribute named name
     * @param {string} name
     * @param {boolean} [signal_change=true]
     * @memberof Model
     */
    Model.prototype.rem_attr = function (name, signal_change) {
        if (signal_change === void 0) { signal_change = true; }
        var item = this[name];
        if (item instanceof Model) {
            var i = item._parents.indexOf(this);
            if (i >= 0) {
                item._parents.splice(i, 1);
                if (item._parents.length === 0) {
                    item.destructor();
                }
            }
            delete this[name];
            i = this._attribute_names.indexOf(name);
            if (i >= 0) {
                this._attribute_names.splice(i, 1);
            }
            if (signal_change) {
                this._signal_change();
            }
        }
    };
    /**
     * change attribute named nname to instanceOfModel (use references for comparison)
     * @param {string} name
     * @param {*} instanceOfModel
     * @param {boolean} [signal_change=true]
     * @return {*}  {void}
     * @memberof Model
     */
    Model.prototype.mod_attr = function (name, instanceOfModel, signal_change) {
        if (signal_change === void 0) { signal_change = true; }
        if (this[name] !== instanceOfModel) {
            this.rem_attr(name);
            return this.add_attr(name, instanceOfModel, signal_change);
        }
    };
    /**
     * add / mod / rem attr to get the same data than o
     *  (assumed to be something like { key: val, ... })
     * @param {{ [key: string]: any }} instanceOfModel
     * @memberof Model
     */
    Model.prototype.set_attr = function (instanceOfModel) {
        var _this = this;
        // new ones / updates
        for (var k in instanceOfModel) {
            this.mod_attr(k, instanceOfModel[k]);
        }
        this._attribute_names
            .filter(function (attrName) { return instanceOfModel[attrName] == null; })
            .forEach(function (attrName) { return _this.rem_attr(attrName); });
    };
    /**
     * dimension of the object -> [] for a scalar, [ length ] for a vector,
     *  [ nb_row, nb_cols ] for a matrix...
     * @param {number} [_for_display=0]
     * @return {*}  {(number | number[])}
     * @memberof Model
     */
    Model.prototype.size = function (_for_display) {
        if (_for_display === void 0) { _for_display = 0; }
        return [];
    };
    /**
     * dimensionnality of the object -> 0 for a scalar, 1 for a vector, ...
     * @param {number} [_for_display=0]
     * @return {*}  {number}
     * @memberof Model
     */
    Model.prototype.dim = function (_for_display) {
        if (_for_display === void 0) { _for_display = 0; }
        var size = this.size(_for_display);
        return Array.isArray(size) ? size.length : size;
    };
    /**
     * @param {Model} m
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.equals = function (m) {
        var e_4, _a, e_5, _b;
        if (this === m)
            return true;
        if (this._attribute_names.length !== m._attribute_names.length)
            return false;
        try {
            // check all own attrs exist in target
            for (var _c = __values(this._attribute_names), _d = _c.next(); !_d.done; _d = _c.next()) {
                var attrName = _d.value;
                if (!m._attribute_names.includes(attrName)) {
                    return false;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            // check target attrs exist in own and is equal
            for (var _e = __values(m._attribute_names), _f = _e.next(); !_f.done; _f = _e.next()) {
                var attrName = _f.value;
                if (this[attrName] == null) {
                    return false;
                }
                var attrModel = m[attrName];
                if (!this[attrName].equals(attrModel)) {
                    return false;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return true;
    };
    /**
     * get first parents that checks func_to_check
     * @param {(model: Model) => boolean} func_to_check
     * @return {*}  {Model[]}
     * @memberof Model
     */
    Model.prototype.get_parents_that_check = function (func_to_check) {
        var res = [];
        var visited = {};
        this._get_parents_that_check_rec(res, visited, func_to_check);
        return res;
    };
    /**
     * @return {*}  {Model}
     * @memberof Model
     */
    Model.prototype.deep_copy = function () {
        var e_6, _a;
        var tmp = {};
        try {
            for (var _b = __values(this._attribute_names), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                tmp[key] = this[key].deep_copy();
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var res = new ModelProcessManager_1.ModelProcessManager._def[ModelProcessManager_1.ModelProcessManager.get_object_class(this)]();
        res.set_attr(tmp);
        return res;
    };
    /**
     * returns true if change is not "cosmetic"
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.real_change = function () {
        var e_7, _a;
        if (this.has_been_directly_modified() && !this._attribute_names.length) {
            return true;
        }
        try {
            for (var _b = __values(this._attribute_names), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attrNames = _c.value;
                if (typeof this.cosmetic_attribute === 'function'
                    ? this.cosmetic_attribute(attrNames)
                    : null) {
                    continue;
                }
                if (this[attrNames].real_change()) {
                    return true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return false;
    };
    /**
     * To be redifined in children if needed
     * @param {string} name
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype.cosmetic_attribute = function (name) {
        return false;
    };
    /**
     * may be redefined
     * @return {*}  {string}
     * @memberof Model
     */
    Model.prototype._get_state = function () {
        var _this = this;
        return this._attribute_names
            .map(function (attrName) { return "".concat(attrName, ":").concat(_this[attrName].model_id); })
            .join(',');
    };
    /**
     * send data to server
     * @param {IFsData} out
     * @return {*}  {string}
     * @memberof Model
     */
    Model.prototype._get_fs_data = function (out) {
        var _this = this;
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        var data = this._attribute_names
            .map(function (attrName) {
            var obj = _this[attrName];
            FileSystem_1.FileSystem.set_server_id_if_necessary(out, obj);
            return attrName + ':' + obj._server_id;
        })
            .join(',');
        out.mod += "C ".concat(this._server_id, " ").concat(data, " ");
    };
    /**
     * may be redefined.
     * by default, add attributes using keys and values (and remove old unused values)
     * must return true if data is changed
     * @protected
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype._set = function (value) {
        var e_8, _a, e_9, _b;
        var change = 0;
        var used = {};
        try {
            // rem
            for (var _c = __values(ModelProcessManager_1.ModelProcessManager._get_attribute_names(value)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var attrName = _d.value;
                used[attrName] = true;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_8) throw e_8.error; }
        }
        try {
            for (var _e = __values(this._attribute_names), _f = _e.next(); !_f.done; _f = _e.next()) {
                var key = _f.value;
                if (!used[key]) {
                    change = 1;
                    this.rem_attr(key, false);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_9) throw e_9.error; }
        }
        // mod / add
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                var val = value[key];
                if (val != null) {
                    if (this[key] != null) {
                        if (this[key].constructor === val.constructor) {
                            change |= this[key].set(val);
                        }
                        else {
                            change = 1;
                            this.mod_attr(key, val, false);
                        }
                    }
                    else {
                        this.add_attr(key, val, false);
                    }
                }
            }
        }
        return !!change;
    };
    /**
     * called by set. change_level should not be defined by the user
     *  (it permits to != change from child of from this)
     * @protected
     * @param {number} [change_level=2]
     * @return {*}  {ReturnType<typeof setTimeout>}
     * @memberof Model
     */
    Model.prototype._signal_change = function (change_level) {
        var e_10, _a;
        if (change_level === void 0) { change_level = 2; }
        if (change_level === 2 && this._server_id != null) {
            FileSystem_1.FileSystem.signal_change(this);
        }
        // register this as a modified model
        ModelProcessManager_1.ModelProcessManager._modlist.set(this.model_id, this);
        // do the same thing for the parents
        if (this._date_last_modification <= ModelProcessManager_1.ModelProcessManager._counter) {
            this._date_last_modification =
                ModelProcessManager_1.ModelProcessManager._counter + change_level;
            try {
                for (var _b = __values(this._parents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var parent_1 = _c.value;
                    parent_1._signal_change(1);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
        // start if not done a timer
        return ModelProcessManager_1.ModelProcessManager._need_sync_processes();
    };
    /**
     * generic definition of _set_state. ( called by _use_state )
     * @param {string} str
     * @param {IStateMap} map
     * @memberof Model
     */
    Model.prototype._set_state = function (str, map) {
        var e_11, _a, e_12, _b;
        var used = {}; // used attributes. Permits to know what to destroy
        if (str.length) {
            try {
                for (var _c = __values(str.split(',')), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var spl = _d.value;
                    var _e = __read(spl.split(':'), 2), attr = _e[0], k_id = _e[1];
                    used[attr] = true;
                    var model = this[attr];
                    if (map[k_id].buff != null) {
                        // if already defined in the map
                        if (model == null) {
                            this.add_attr(attr, map[k_id].buff);
                        }
                        else if (map[k_id].buff !== model) {
                            this.mod_attr(attr, map[k_id].buff);
                        }
                    }
                    else if (model == null) {
                        // else, if the attribute does not exist, we create if
                        this.add_attr(attr, ModelProcessManager_1.ModelProcessManager._new_model_from_state(k_id, map));
                    }
                    else if (!model._set_state_if_same_type(k_id, map)) {
                        // else, we already have an attribute and map has not been already explored
                        this.mod_attr(attr, ModelProcessManager_1.ModelProcessManager._new_model_from_state(k_id, map));
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
        try {
            for (var _f = __values(this._attribute_names), _g = _f.next(); !_g.done; _g = _f.next()) {
                var attrName = _g.value;
                if (!used[attrName])
                    this.rem_attr(attrName);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    /**
     * see get_parents_that_check
     * @private
     * @param {Model[]} res
     * @param {{ [attrName: string]: boolean }} visited
     * @param {(model: Model) => boolean} func_to_check
     * @memberof Model
     */
    Model.prototype._get_parents_that_check_rec = function (res, visited, func_to_check) {
        var e_13, _a;
        if (visited[this.model_id] == null) {
            visited[this.model_id] = true;
            if (func_to_check(this)) {
                res.push(this);
            }
            else {
                try {
                    for (var _b = __values(this._parents), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var parent_2 = _c.value;
                        parent_2._get_parents_that_check_rec(res, visited, func_to_check);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            }
        }
    };
    /**
     * return true if info from map[ mid ] if compatible with this.
     * If it's the case, use this information to update data
     * @protected
     * @param {string} mid
     * @param {IStateMap<Model>} map
     * @return {*}  {boolean}
     * @memberof Model
     */
    Model.prototype._set_state_if_same_type = function (mid, map) {
        var dat = map[mid];
        if (ModelProcessManager_1.ModelProcessManager.get_object_class(this) === dat.type) {
            dat.buff = this;
            this._set_state(dat.data, map);
            return true;
        }
        return false;
    };
    /**
     * map[ id ] = obj for each objects starting from this recursively
     * @protected
     * @param {IFlatModelMap} map
     * @param {number} date
     * @return {*}  {IFlatModelMap}
     * @memberof Model
     */
    Model.prototype._get_flat_model_map = function (map, date) {
        var e_14, _a;
        map[this.model_id] = this;
        try {
            for (var _b = __values(this._attribute_names), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_2 = _c.value;
                var obj = this[name_2];
                if (map[obj.model_id] == null) {
                    if (obj._date_last_modification > date) {
                        obj._get_flat_model_map(map, date);
                    }
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
        return map;
    };
    Model._constructorName = 'Model';
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=Model.js.map