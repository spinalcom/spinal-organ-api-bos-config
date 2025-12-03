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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Lst = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
var ModelProcessManager_1 = require("../ModelProcessManager");
var Model_1 = require("./Model");
/**
 * Bese representation of an Array
 * @export
 * @class Lst
 * @extends {Model}
 * @template T
 */
var Lst = /** @class */ (function (_super) {
    __extends(Lst, _super);
    /**
     * Creates an instance of Lst.
     * @param {*} [data]
     * @memberof Lst
     */
    function Lst(data) {
        var _this = _super.call(this) || this;
        /**
         * @type {number}
         * @memberof Lst
         */
        _this.length = 0;
        var s = _this.static_length();
        if (s >= 0) {
            var d = _this.default_value();
            for (var i = 0; i <= s; i++) {
                _this.push(d, true);
            }
        }
        if (data)
            _this._set(data);
        return _this;
    }
    /**
     * @return {*}  {number}
     * @memberof Lst
     */
    Lst.prototype.static_length = function () {
        return -1;
    };
    /**
     * @protected
     * @return {*}  {number}
     * @memberof Lst
     */
    Lst.prototype.default_value = function () {
        return 0;
    };
    /**
     * @protected
     * @return {*}  {*}
     * @memberof Lst
     */
    Lst.prototype.base_type = function () {
        return undefined;
    };
    /**
     * @return {*}  {ReturnType<T['get']>[]}
     * @memberof Lst
     */
    Lst.prototype.get = function () {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i])
                res.push(this[i].get());
        }
        return res;
    };
    /**
     * @return {*}  {[number]}
     * @memberof Lst
     */
    Lst.prototype.size = function () {
        return [this.length];
    };
    /**
     * @return {*}  {string}
     * @memberof Lst
     */
    Lst.prototype.toString = function () {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            res.push(this[i].toString());
        }
        if (res.length > 0)
            return res.join();
        return '';
    };
    /**
     * @param {Lst<T>} lst
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.equals = function (lst) {
        if (lst.length !== this.length)
            return false;
        for (var i = 0; i < this.length; i++) {
            if (!this[i].equals(lst[i]))
                return false;
        }
        return true;
    };
    /**
     * @param {*} value
     * @param {boolean} [force=false]
     * @return {*}  {void}
     * @memberof Lst
     */
    Lst.prototype.push = function (value, force) {
        if (force === void 0) { force = false; }
        if (this._static_size_check(force))
            return;
        var b = this.base_type();
        if (b) {
            if (!(value instanceof b))
                value = new b(value);
        }
        else {
            value = ModelProcessManager_1.ModelProcessManager.conv(value);
        }
        if (value._parents.indexOf(this) === -1) {
            value._parents.push(this);
        }
        this[this.length++] = value;
        this._signal_change();
    };
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    Lst.prototype.pop = function () {
        if (this._static_size_check(false))
            return;
        if (this.length <= 0)
            return;
        var res = this[--this.length];
        this.rem_attr(this.length.toString(10));
        return res;
    };
    /**
     * @memberof Lst
     */
    Lst.prototype.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    /**
     * @param {*} value
     * @return {*}  {number}
     * @memberof Lst
     */
    Lst.prototype.unshift = function (value) {
        if (this._static_size_check(false)) {
            return;
        }
        var b = this.base_type();
        if (b != null) {
            if (!(value instanceof b))
                value = new b(value);
        }
        else
            value = ModelProcessManager_1.ModelProcessManager.conv(value);
        if (value._parents.indexOf(this) < 0)
            value._parents.push(this);
        if (this.length) {
            for (var i = this.length - 1; i >= 0; i--) {
                this[i + 1] = this[i];
            }
        }
        this[0] = value;
        this.length += 1;
        this._signal_change();
        return this.length;
    };
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    Lst.prototype.shift = function () {
        var res = this[0];
        this.slice(0, 1);
        return res;
    };
    /**
     * @param {T} item
     * @memberof Lst
     */
    Lst.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index >= 0)
            this.splice(index, 1);
    };
    /**
     * @param {T} item
     * @memberof Lst
     */
    Lst.prototype.remove_ref = function (item) {
        var index = this.indexOf_ref(item);
        if (index >= 0)
            this.splice(index, 1);
    };
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {T[]}
     * @memberof Lst
     */
    Lst.prototype.filter = function (f) {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            if (f(this[i]))
                res.push(this[i]);
        }
        return res;
    };
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {T}
     * @memberof Lst
     */
    Lst.prototype.detect = function (f) {
        for (var i = 0; i < this.length; i++) {
            if (f(this[i]))
                return this[i];
        }
        return undefined;
    };
    /**
     * @param {SpinalSortFunction<T>} sort
     * @return {*}  {Array<T>}
     * @memberof Lst
     */
    Lst.prototype.sorted = function (sort) {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            res.push(this[i]);
        }
        return res.sort(sort);
    };
    /**
     * @param {SpinalFilterFunction<T>} f
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.has = function (f) {
        for (var i = 0; i < this.length; i++) {
            if (f(this[i]))
                return true;
        }
        return false;
    };
    /**
     * @param {T} value
     * @return {*}  {(number | -1)} -1 if not found
     * @memberof Lst
     */
    Lst.prototype.indexOf = function (value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].equals(value))
                return i;
        }
        return -1;
    };
    /**
     * @param {T} value
     * @return {*}  {number}
     * @memberof Lst
     */
    Lst.prototype.indexOf_ref = function (value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == value)
                return i;
        }
        return -1;
    };
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.contains_ref = function (value) {
        return this.indexOf_ref(value) !== -1;
    };
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.toggle = function (value) {
        var index = this.indexOf(value);
        if (index !== -1) {
            this.splice(index);
            return false;
        }
        else {
            this.push(value);
            return true;
        }
    };
    /**
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.toggle_ref = function (value) {
        var index = this.indexOf_ref(value);
        if (index !== -1) {
            this.splice(index);
            return false;
        }
        else {
            this.push(value);
            return true;
        }
    };
    /**
     * @param {number} begin
     * @param {number} [end=this.length]
     * @return {*}  {Lst<T>}
     * @memberof Lst
     */
    Lst.prototype.slice = function (begin, end) {
        if (end === void 0) { end = this.length; }
        var res = new Lst();
        if (begin < 0)
            begin = 0;
        if (end > this.length)
            end = this.length;
        for (var i = begin; i < end; i++) {
            res.push(this[i].get());
        }
        return res;
    };
    /**
     * @param {Lst<T>} new_tab
     * @param {boolean} [force=false]
     * @return {*}  {void}
     * @memberof Lst
     */
    Lst.prototype.concat = function (new_tab, force) {
        if (force === void 0) { force = false; }
        if (this._static_size_check(force))
            return;
        if (new_tab.length) {
            for (var i = 0; i < new_tab.length; i++) {
                this.push(new_tab[i]);
            }
        }
    };
    /**
     * @param {number} index
     * @param {number} [n=1]
     * @return {*}  {void}
     * @memberof Lst
     */
    Lst.prototype.splice = function (index, n) {
        if (n === void 0) { n = 1; }
        if (this._static_size_check(false))
            return;
        var end = Math.min(index + n, this.length);
        for (var i = index; i < end; i++)
            this.rem_attr(i.toString(10));
        for (var i = index; i < this.length - n; i++)
            this[i] = this[i + n];
        for (var i = this.length - n; i < this.length; i++)
            delete this[i];
        this.length -= n;
        this._signal_change();
    };
    /**
     * @param {number} index
     * @param {(Lst<T> | T[] | Lst<any> | any[])} lst
     * @memberof Lst
     */
    Lst.prototype.insert = function (index, lst) {
        var end = Math.max(this.length - index, 0);
        var res = [];
        for (var i = 0; i < end; i++) {
            res.push(this.pop());
        }
        res.reverse();
        for (var i = 0; i < lst.length; i++) {
            // @ts-ignore
            this.push(lst[i]);
        }
        for (var i = 0; i < res.length; i++) {
            this.push(res[i]);
        }
    };
    /**
     * @param {number} index
     * @param {T} val
     * @return {*}  {void}
     * @memberof Lst
     */
    Lst.prototype.set_or_push = function (index, val) {
        if (index < this.length) {
            return this.mod_attr(index.toString(), val);
        }
        if (index === this.length) {
            this.push(val);
        }
    };
    /**
     * @param {number} size
     * @memberof Lst
     */
    Lst.prototype.trim = function (size) {
        while (this.length > size)
            this.pop();
    };
    /**
     * @param {string} sep
     * @return {*}  {string}
     * @memberof Lst
     */
    Lst.prototype.join = function (sep) {
        return this.get().join(sep);
    };
    /**
     * @return {*}  {Lst<T>}
     * @memberof Lst
     */
    Lst.prototype.deep_copy = function () {
        var res = new Lst();
        for (var i = 0; i < this.length; i++)
            res.push(this[i].deep_copy());
        return res;
    };
    /**
     * @return {*}  {T}
     * @memberof Lst
     */
    Lst.prototype.back = function () {
        return this[this.length - 1];
    };
    /**
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype.real_change = function () {
        if (this.has_been_directly_modified())
            return true;
        for (var i = 0; i < this.length; i++) {
            if (this[i].real_change())
                return true;
        }
        return false;
    };
    /**
     * @protected
     * @param {Lst<T>} value
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype._set = function (value) {
        var change = Number(this.length != value.length);
        var s = this.static_length();
        if (s >= 0 && change) {
            console.error("resizing a static array (type ".concat(ModelProcessManager_1.ModelProcessManager.get_object_class(this), ") is forbidden"));
        }
        for (var i = 0; i < value.length; i++) {
            // @ts-ignore
            if (i < this.length)
                change |= this[i].set(value[i]);
            else if (s < 0) {
                // @ts-ignore
                this.push(value[i]);
            }
        }
        if (s < 0) {
            while (this.length > value.length) {
                this.pop();
            }
            this.length = value.length;
        }
        return Boolean(change);
    };
    /**
     * @protected
     * @param {IFlatModelMap} map
     * @param {number} date
     * @return {*}  {IFlatModelMap}
     * @memberof Lst
     */
    Lst.prototype._get_flat_model_map = function (map, date) {
        map[this.model_id] = this;
        for (var i = 0; i < this.length; i++) {
            if (!map.hasOwnProperty(this[i]))
                if (this[i]._date_last_modification > date)
                    this[i]._get_flat_model_map(map, date);
        }
        return map;
    };
    /**
     * @param {IFsData} out
     * @memberof Lst
     */
    Lst.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        var res = [];
        for (var i = 0; i < this.length; i++) {
            var obj = this[i];
            FileSystem_1.FileSystem.set_server_id_if_necessary(out, obj);
            res.push(obj._server_id);
        }
        out.mod += "C ".concat(this._server_id, " ").concat(res.join(','), " ");
    };
    /**
     * @protected
     * @return {*}  {string}
     * @memberof Lst
     */
    Lst.prototype._get_state = function () {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            res.push(this[i].model_id);
        }
        return res.join(',');
    };
    /**
     * @param {string} str
     * @param {IStateMap<T>} map
     * @memberof Lst
     */
    Lst.prototype._set_state = function (str, map) {
        var l_id = str.split(',').filter(function (x) {
            return x.length;
        });
        while (this.length > l_id.length)
            this.pop();
        for (var i = 0; i < this.length; i++) {
            var k_id = l_id[i];
            if (map[k_id].buff) {
                if (map[k_id].buff != this[i])
                    this.mod_attr(i.toString(10), map[k_id].buff);
            }
            else if (!this[i]._set_state_if_same_type(k_id, map)) {
                this.mod_attr(i.toString(10), ModelProcessManager_1.ModelProcessManager._new_model_from_state(k_id, map));
            }
        }
        for (var i = this.length; i < l_id.length; i++) {
            var k_id = l_id[i];
            if (map[k_id].hasOwnProperty('buff') && map[k_id].buff !== null)
                this.push(map[k_id].buff);
            else
                this.push(ModelProcessManager_1.ModelProcessManager._new_model_from_state(k_id, map));
        }
    };
    /**
     * @param {boolean} force
     * @return {*}  {boolean}
     * @memberof Lst
     */
    Lst.prototype._static_size_check = function (force) {
        if (this.static_length() >= 0 && !force) {
            console.error("resizing a static array (type " +
                "".concat(ModelProcessManager_1.ModelProcessManager.get_object_class(this), ") is forbidden"));
            return true;
        }
        return false;
    };
    /**
     * @return {*}  {Generator<T, void, unknown>}
     * @memberof Lst
     */
    Lst.prototype[Symbol.iterator] = function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < this.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, this[i]];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    /**
     * @static
     * @type {string}
     * @memberof Lst
     */
    Lst._constructorName = 'Lst';
    return Lst;
}(Model_1.Model));
exports.Lst = Lst;
//# sourceMappingURL=Lst.js.map