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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.FileSystem = void 0;
var ModelProcessManager_1 = require("../ModelProcessManager");
var NewAlertMsg_1 = require("../Utils/DomHelper/NewAlertMsg");
var getUrlPath_1 = require("../Utils/getUrlPath");
var Directory_1 = require("./Models/Directory");
/**
 * intance of the connection to an server
 * @export
 * @class FileSystem
 */
var FileSystem = /** @class */ (function () {
    function FileSystem(_a) {
        var protocol = _a.protocol, url = _a.url, port = _a.port, home_dir = _a.home_dir, userid = _a.userid, password = _a.password, sessionId = _a.sessionId, accessToken = _a.accessToken;
        /**
         * @private
         * @type {string}
         * @memberof FileSystem
         */
        this._url = '127.0.0.1';
        /**
         * @private
         * @type {(string | number)}
         * @memberof FileSystem
         */
        this._port = '8888';
        /**
         * @private
         * @type {string}
         * @memberof FileSystem
         */
        this._accessToken = null;
        // default values
        this._data_to_send = '';
        this._session_num = -2;
        this._num_inst = FileSystem._nb_insts++;
        this.make_channel_error_timer = 0;
        this._protocol = protocol ? protocol : 'http:';
        this._url = url;
        this._port = port;
        this._home_dir = home_dir;
        if (typeof accessToken === 'string') {
            var _accessToken = accessToken.startsWith('Bearer ')
                ? accessToken
                : "Bearer ".concat(accessToken);
            this._accessToken = _accessToken;
        }
        if (typeof global !== 'undefined') {
            var XMLHttpRequest_node = require('xhr2');
            FileSystem._XMLHttpRequest = XMLHttpRequest_node;
        }
        this._num_inst = FileSystem._nb_insts++;
        this.make_channel_error_timer = 0;
        // register this in FileSystem instances
        FileSystem._insts[this._num_inst] = this;
        // first, we need a session id fom the server
        if (!sessionId) {
            if (userid != null) {
                this.send("U ".concat(userid, " ").concat(password, " "));
            }
            this.send("S ".concat(this._num_inst, " "));
        }
        else {
            FileSystem._insts[this._num_inst]._session_num = sessionId;
            FileSystem._insts[this._num_inst].make_channel();
        }
    }
    FileSystem.prototype.load = function (path, callback) {
        var _this = this;
        if (typeof callback === 'undefined') {
            return new Promise(function (resolve, reject) {
                FileSystem._send_chan();
                _this.send("L ".concat(FileSystem._nb_callbacks, " ").concat(encodeURI(path), " "));
                FileSystem._callbacks[FileSystem._nb_callbacks] = function (model, isError) {
                    if (!model || isError)
                        reject(new Error('Error Load'));
                    resolve(model);
                };
                FileSystem._nb_callbacks++;
            });
        }
        FileSystem._send_chan();
        this.send("L ".concat(FileSystem._nb_callbacks, " ").concat(encodeURI(path), " "));
        FileSystem._callbacks[FileSystem._nb_callbacks] = callback;
        FileSystem._nb_callbacks++;
    };
    /**
     * load all the objects of $type
     * @template T
     * @param {string} type
     * @param {SpinalLoadCallBack<T>} callback
     * @memberof FileSystem
     */
    FileSystem.prototype.load_type = function (type, callback) {
        FileSystem._send_chan();
        this.send("R 0 ".concat(type, " "));
        FileSystem._type_callbacks.push([type, callback]);
    };
    FileSystem.prototype.load_or_make_dirProm = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, lst, nir, oir, n_res, n_dir, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, this.load(dir)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_1 = _a.sent();
                        if (dir === '/')
                            throw error_1;
                        lst = dir
                            .split('/')
                            .reduce(function (acc, v) {
                            if (v.length)
                                acc.push(v);
                            return acc;
                        }, []);
                        nir = lst.pop();
                        oir = '/' + lst.join('/');
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.load_or_make_dirProm(oir)];
                    case 4:
                        n_res = _a.sent();
                        n_dir = new Directory_1.Directory();
                        n_res.add_file(nir, n_dir);
                        return [2 /*return*/, n_dir];
                    case 5:
                        error_2 = _a.sent();
                        throw error_2;
                    case 6: return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FileSystem.prototype.load_or_make_dir = function (dir, callback) {
        var _this = this;
        if (typeof callback === 'undefined')
            return this.load_or_make_dirProm(dir);
        this.load(dir, function (res, err) {
            if (err) {
                if (dir === '/') {
                    return callback(null, err);
                }
                else {
                    var lst = dir
                        .split('/')
                        .reduce(function (acc, v) {
                        if (v.length)
                            acc.push(v);
                        return acc;
                    }, []);
                    var nir_1 = lst.pop();
                    var oir = '/' + lst.join('/');
                    _this.load_or_make_dir(oir, function (n_res, n_err) {
                        if (n_err) {
                            return callback(null, n_err);
                        }
                        else {
                            var n_dir = new Directory_1.Directory();
                            n_res.add_file(nir_1, n_dir);
                            return callback(n_dir, n_err);
                        }
                    });
                }
            }
            else {
                return callback(res, err);
            }
        });
    };
    FileSystem.prototype.load_ptr = function (ptr, callback) {
        var _this = this;
        if (typeof callback === 'undefined') {
            if (!ptr)
                return Promise.reject('Error Load ptr');
            if (typeof FileSystem._objects[ptr] !== 'undefined') {
                return Promise.resolve(FileSystem._objects[ptr]);
            }
            return new Promise(function (resolve, reject) {
                FileSystem._send_chan();
                _this.send("l ".concat(FileSystem._nb_callbacks, " ").concat(ptr, " "));
                FileSystem._callbacks[FileSystem._nb_callbacks] = function (model, isError) {
                    if (!model || isError)
                        reject(new Error('Error Load ptr'));
                    resolve(model);
                };
                FileSystem._nb_callbacks++;
            });
        }
        if (!ptr)
            setImmediate(function () { return callback(undefined); });
        else if (typeof FileSystem._objects[ptr] !== 'undefined') {
            setImmediate(function () { return callback(FileSystem._objects[ptr]); });
        }
        else {
            FileSystem._send_chan();
            this.send("l ".concat(FileSystem._nb_callbacks, " ").concat(ptr, " "));
            FileSystem._callbacks[FileSystem._nb_callbacks] = callback;
            FileSystem._nb_callbacks++;
        }
    };
    FileSystem.prototype.load_right = function (ptr, callback) {
        var _this = this;
        if (typeof callback === 'undefined') {
            return new Promise(function (resolve, reject) {
                FileSystem._send_chan();
                _this.send("r ".concat(ptr, " ").concat(FileSystem._nb_callbacks, " "));
                FileSystem._callbacks[FileSystem._nb_callbacks] = function (model) {
                    if (!model)
                        reject(new Error('Error load_right'));
                    resolve(model);
                };
                FileSystem._nb_callbacks++;
            });
        }
        FileSystem._send_chan();
        this.send("r ".concat(ptr, " ").concat(FileSystem._nb_callbacks, " "));
        FileSystem._callbacks[FileSystem._nb_callbacks] = callback;
        FileSystem._nb_callbacks++;
    };
    /**
     * @param {(Model | number)} ptr
     * @param {string} file_name
     * @param {number} share_type
     * @param {string} targetName
     * @memberof FileSystem
     */
    FileSystem.prototype.share_model = function (ptr, file_name, share_type, targetName) {
        FileSystem._send_chan();
        this.send("h ".concat(typeof ptr === 'number' ? ptr : ptr._server_id, " ").concat(share_type, " ").concat(encodeURI(targetName), " ").concat(encodeURI(file_name), " "));
    };
    /**
     * explicitly send a command
     * @private
     * @param {string} data
     * @memberof FileSystem
     */
    FileSystem.prototype.send = function (data) {
        this._data_to_send += data;
        if (FileSystem._timer_send == null) {
            FileSystem._timer_send = setTimeout(FileSystem._timeout_send_func, 1);
        }
    };
    /**
     * send a request for a "push" channel
     * @private
     * @memberof FileSystem
     */
    FileSystem.prototype.make_channel = function () {
        var fs = FileSystem.get_inst();
        var path = (0, getUrlPath_1.getUrlPath)(fs._protocol, fs._url, fs._port, "?s=".concat(this._session_num));
        var xhr_object = FileSystem._my_xml_http_request();
        xhr_object.open('GET', path, true);
        if (fs._accessToken)
            xhr_object.setRequestHeader('authorization', fs._accessToken);
        xhr_object.onreadystatechange = function () {
            var e_1, _a;
            if (this.readyState === 4 && this.status === 200) {
                if (fs.make_channel_error_timer !== 0) {
                    FileSystem.onConnectionError(0);
                }
                fs.make_channel_error_timer = 0;
                if (FileSystem._disp) {
                    console.log('chan ->', this.responseText);
                }
                var created_2 = [];
                var _w = function (sid, obj) {
                    var e_2, _a;
                    var _obj = FileSystem._create_model_by_name(obj);
                    if (sid != null && _obj != null) {
                        _obj._server_id = sid;
                        FileSystem._objects[sid] = _obj;
                        try {
                            for (var _b = __values(FileSystem._type_callbacks), _d = _b.next(); !_d.done; _d = _b.next()) {
                                var _e = __read(_d.value, 2), type = _e[0], cb = _e[1];
                                // @ts-ignore
                                var mod_R = ModelProcessManager_1.ModelProcessManager._def[type] ||
                                    ModelProcessManager_1.ModelProcessManager.spinal[type];
                                if (_obj instanceof mod_R) {
                                    created_2.push({ cb: cb, _obj: _obj });
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _b["return"])) _a.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                };
                FileSystem._sig_server = false;
                eval(this.responseText);
                FileSystem._sig_server = true;
                try {
                    for (var created_1 = __values(created_2), created_1_1 = created_1.next(); !created_1_1.done; created_1_1 = created_1.next()) {
                        var _b = created_1_1.value, cb = _b.cb, _obj = _b._obj;
                        cb(_obj);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (created_1_1 && !created_1_1.done && (_a = created_1["return"])) _a.call(created_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else if (this.readyState === 4 && this.status === 0) {
                console.error("Disconnected from the server with request : ".concat(path, "."));
                if (fs.make_channel_error_timer === 0) {
                    //first disconnect
                    console.log('Trying to reconnect.');
                    fs.make_channel_error_timer = Date.now();
                    setTimeout(fs.make_channel.bind(fs), 1000);
                    return FileSystem.onConnectionError(1);
                }
                else if (Date.now() - fs.make_channel_error_timer <
                    FileSystem._timeout_reconnect) {
                    // under timeout
                    setTimeout(fs.make_channel.bind(fs), 1000); // timeout reached
                }
                else {
                    return FileSystem.onConnectionError(2);
                }
            }
            else if (this.readyState === 4 &&
                this.status >= 500 &&
                this.status < 600) {
                FileSystem.onConnectionError(3);
            }
        };
        xhr_object.send();
    };
    /**
     * default callback on make_channel error after the timeout disconnected reached
     * This method can be surcharged.
     * error_code :
     * - 0 = Error resolved
     * - 1 = 1st disconnection
     * - 2 = disconnection timeout
     * - 3 = Server went down Reinit everything
     * - 4 = Server down on connection
     * @private
     * @static
     * @param {number} error_code
     * @memberof FileSystem
     */
    FileSystem._onConnectionError = function (error_code) {
        var msg = '';
        if (error_code === 0) {
            // Error resolved
            if (FileSystem.CONNECTOR_TYPE === 'Browser' || FileSystem.is_cordova) {
                FileSystem.popup.hide();
            }
            else {
                console.log('Reconnected to the server.');
            }
        }
        else if (error_code === 1) {
            // 1st disconnection
            if (FileSystem.CONNECTOR_TYPE === 'Browser' || FileSystem.is_cordova) {
                msg = 'Disconnected from the server, trying to reconnect...';
            }
            else {
                console.error('Disconnected from the server, trying to reconnect...');
            }
        }
        else if (error_code === 2 || error_code === 3 || error_code === 4) {
            if (FileSystem.CONNECTOR_TYPE === 'Browser' || FileSystem.is_cordova) {
                msg = 'Disconnected from the server, please refresh the window.';
            }
            else if (FileSystem.CONNECTOR_TYPE === 'Node') {
                console.error('Disconnected from the server.');
                process.exit();
            }
            else {
                console.error('Disconnected from the server.');
            }
        }
        if (msg !== '') {
            if (typeof FileSystem.popup === 'undefined') {
                FileSystem.popup = new NewAlertMsg_1.NewAlertMsg({
                    parent: document.getElementsByTagName('BODY')[0],
                    msg: msg,
                    btn: [
                        {
                            txt: 'reload page',
                            click: window.location.reload.bind(window.location),
                            backgroundColor: '#ff5b57'
                        },
                        {
                            txt: 'close',
                            backgroundColor: '#348fe2',
                            click: function () {
                                return FileSystem.popup.hide();
                            }
                        },
                    ]
                });
            }
            else {
                FileSystem.popup.show();
            }
            if (error_code === 2 || error_code === 3 || error_code === 4) {
                FileSystem.popup.show_btn();
            }
            else {
                FileSystem.popup.hide_btn();
            }
            FileSystem.popup.setMsg(msg);
        }
    };
    /**
     * get the first running inst
     * @static
     * @return {*}  {FileSystem}
     * @memberof FileSystem
     */
    FileSystem.get_inst = function () {
        for (var k in FileSystem._insts) {
            return FileSystem._insts[k];
        }
    };
    /**
     * @static
     * @param {IFsData} out
     * @param {Model} obj
     * @memberof FileSystem
     */
    FileSystem.set_server_id_if_necessary = function (out, obj) {
        if (obj._server_id == null) {
            // registering
            obj._server_id = FileSystem._get_new_tmp_server_id();
            FileSystem._tmp_objects[obj._server_id] = obj;
            // new object
            var ncl = ModelProcessManager_1.ModelProcessManager.get_object_class(obj);
            if (obj._underlying_fs_type != null) {
                out.mod += "T ".concat(obj._server_id, " ").concat(ncl, " ");
                ncl = obj._underlying_fs_type();
            }
            out.cre += "N ".concat(obj._server_id, " ").concat(ncl, " ");
            // data
            obj._get_fs_data(out);
        }
    };
    /**
     * send changes of m to instances.
     * @static
     * @param {Model} m
     * @memberof FileSystem
     */
    FileSystem.signal_change = function (m) {
        if (FileSystem._sig_server) {
            FileSystem._objects_to_send[m.model_id] = m;
            if (FileSystem._timer_chan != null) {
                clearTimeout(FileSystem._timer_chan);
            }
            FileSystem._timer_chan = setTimeout(FileSystem._timeout_chan_func, 250);
        }
    };
    /**
     * @static
     * @param {number} tmp_id
     * @param {number} res
     * @return {*}  {void}
     * @memberof FileSystem
     */
    FileSystem._tmp_id_to_real = function (tmp_id, res) {
        var tmp = FileSystem._tmp_objects[tmp_id];
        if (tmp == null) {
            console.log(tmp_id);
        }
        FileSystem._objects[res] = tmp;
        tmp._server_id = res;
        delete FileSystem._tmp_objects[tmp_id];
        var ptr = FileSystem._ptr_to_update[tmp_id];
        if (ptr != null) {
            delete FileSystem._ptr_to_update[tmp_id];
            ptr.data.value = res;
        }
        if (FileSystem._files_to_upload[tmp_id] != null && tmp.file != null) {
            delete FileSystem._files_to_upload[tmp_id];
            // send the file
            var fs = FileSystem.get_inst();
            var path = (0, getUrlPath_1.getUrlPath)(fs._protocol, fs._url, fs._port, "?s=".concat(fs._session_num, "&p=").concat(tmp._server_id));
            var xhr_object = FileSystem._my_xml_http_request();
            xhr_object.open('PUT', path, true);
            if (fs._accessToken)
                xhr_object.setRequestHeader('authorization', fs._accessToken);
            xhr_object.onreadystatechange = function () {
                var _w;
                if (this.readyState === 4 && this.status === 200) {
                    _w = function (sid, obj) {
                        var _obj = FileSystem._create_model_by_name(obj);
                        if (sid != null && _obj != null) {
                            _obj._server_id = sid;
                            return (FileSystem._objects[sid] = _obj);
                        }
                    };
                    return eval(this.responseText);
                }
            };
            xhr_object.send(tmp.file);
            delete tmp.file;
        }
        return FileSystem.signal_change(FileSystem._objects[res]);
    };
    FileSystem._create_model_by_name = function (name) {
        if (typeof name !== 'string') {
            return name; // for old spinalcore version
        }
        if (typeof ModelProcessManager_1.ModelProcessManager._def[name] !== 'undefined') {
            return new ModelProcessManager_1.ModelProcessManager._def[name]();
        }
        if (typeof ModelProcessManager_1.ModelProcessManager.spinal[name] === 'undefined') {
            if (FileSystem.debug === true) {
                console.warn("Got Model type \"".concat(name, "\" from hub but not registered."));
            }
            ModelProcessManager_1.ModelProcessManager._def[name] = new Function("return class ".concat(name, " extends ModelProcessManager._def[\"Model\"] {}"))();
            return new ModelProcessManager_1.ModelProcessManager._def[name]();
        }
    };
    /**
     * @deprecated
     * @static
     * @param {*} _child
     * @param {*} _parent
     * @return {*}  {*}
     * @memberof FileSystem
     */
    FileSystem.extend = function (_child, _parent) {
        throw 'FileSystem.extend is a legacy function, do not use';
    };
    /**
     * @private
     * @static
     * @return {*}  {number}
     * @memberof FileSystem
     */
    FileSystem._get_new_tmp_server_id = function () {
        FileSystem._cur_tmp_server_id++;
        if (FileSystem._cur_tmp_server_id % 4 === 0) {
            FileSystem._cur_tmp_server_id++;
        }
        return FileSystem._cur_tmp_server_id;
    };
    /**
     * send changes
     * @private
     * @static
     * @memberof FileSystem
     */
    FileSystem._send_chan = function () {
        var out = FileSystem._get_chan_data();
        for (var f in FileSystem._insts) {
            FileSystem._insts[f].send(out);
        }
    };
    /**
     * timeout for at least one changed object
     * @private
     * @static
     * @memberof FileSystem
     */
    FileSystem._timeout_chan_func = function () {
        FileSystem._send_chan();
        delete FileSystem._timer_chan;
    };
    /**
     * get data of objects to send
     * @private
     * @static
     * @return {*}  {string}
     * @memberof FileSystem
     */
    FileSystem._get_chan_data = function () {
        var out = {
            cre: '',
            mod: ''
        };
        for (var n in FileSystem._objects_to_send) {
            FileSystem._objects_to_send[n]._get_fs_data(out);
        }
        FileSystem._objects_to_send = {};
        return out.cre + out.mod;
    };
    /**
     * @private
     * @static
     * @memberof FileSystem
     */
    FileSystem._timeout_send_func = function () {
        // if some model have changed, we have to send the changes now
        var out = FileSystem._get_chan_data();
        for (var k in FileSystem._insts) {
            FileSystem._insts[k]._data_to_send += out;
        }
        // send data
        for (var k in FileSystem._insts) {
            var fs = FileSystem._insts[k];
            if (!fs._data_to_send.length || fs._session_num === -1)
                continue;
            // (@responseText will contain another call to @_timeout_send with the session id)
            // for first call, do not add the session id (but say that we are waiting for one)
            if (fs._session_num === -2) {
                fs._session_num = -1;
            }
            else {
                fs._data_to_send = "s ".concat(fs._session_num, " ").concat(fs._data_to_send);
            }
            // request
            var path = (0, getUrlPath_1.getUrlPath)(fs._protocol, fs._url, fs._port);
            var xhr_object = FileSystem._my_xml_http_request();
            xhr_object.open('POST', path, true);
            if (fs._accessToken)
                xhr_object.setRequestHeader('authorization', fs._accessToken);
            xhr_object.onreadystatechange = function () {
                var e_3, _a, e_4, _b;
                if (this.readyState === 4 && this.status === 200) {
                    if (FileSystem._disp) {
                        console.log('resp ->', this.responseText);
                    }
                    var _c = []; // callbacks
                    var created_4 = [];
                    var _w = function (sid, obj) {
                        var e_5, _a;
                        var _obj = FileSystem._create_model_by_name(obj);
                        if (sid != null && _obj != null) {
                            _obj._server_id = sid;
                            FileSystem._objects[sid] = _obj;
                            try {
                                for (var _b = __values(FileSystem._type_callbacks), _d = _b.next(); !_d.done; _d = _b.next()) {
                                    var _e = __read(_d.value, 2), type = _e[0], cb = _e[1];
                                    var mod_R = ModelProcessManager_1.ModelProcessManager.spinal[type] ||
                                        ModelProcessManager_1.ModelProcessManager._def[type];
                                    if (_obj instanceof mod_R) {
                                        created_4.push({ cb: cb, _obj: _obj });
                                    }
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_a = _b["return"])) _a.call(_b);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                    };
                    FileSystem._sig_server = false;
                    eval(this.responseText);
                    FileSystem._sig_server = true;
                    try {
                        for (var created_3 = __values(created_4), created_3_1 = created_3.next(); !created_3_1.done; created_3_1 = created_3.next()) {
                            var _d = created_3_1.value, cb = _d.cb, _obj = _d._obj;
                            cb(_obj);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (created_3_1 && !created_3_1.done && (_a = created_3["return"])) _a.call(created_3);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    try {
                        for (var _c_1 = __values(_c), _c_1_1 = _c_1.next(); !_c_1_1.done; _c_1_1 = _c_1.next()) {
                            var _e = __read(_c_1_1.value, 3), nbCb = _e[0], servId = _e[1], error = _e[2];
                            FileSystem._callbacks[nbCb](FileSystem._objects[servId], error);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_c_1_1 && !_c_1_1.done && (_b = _c_1["return"])) _b.call(_c_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
                else if (this.readyState === 4 &&
                    (this.status === 0 || (this.status >= 500 && this.status < 600))) {
                    return FileSystem.onConnectionError(4);
                }
            };
            if (FileSystem._disp) {
                console.log('sent ->', fs._data_to_send + 'E ');
            }
            xhr_object.setRequestHeader('Content-Type', 'text/plain');
            xhr_object.send(fs._data_to_send + 'E ');
            fs._data_to_send = '';
        }
        FileSystem._objects_to_send = {};
        delete FileSystem._timer_send;
    };
    /**
     * @static
     * @return {*}  {*}
     * @memberof FileSystem
     */
    FileSystem._my_xml_http_request = function () {
        if (FileSystem.CONNECTOR_TYPE === 'Browser') {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            if (window.ActiveXObject) {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
            return alert('Your browser does not seem to support XMLHTTPRequest objects...');
        }
        else if (FileSystem.CONNECTOR_TYPE === 'Node') {
            return new FileSystem._XMLHttpRequest();
        }
        else {
            console.error('you must define CONNECTOR_TYPE');
        }
    };
    FileSystem._constructorName = 'FileSystem';
    // when object are saved, their _server_id is assigned to a tmp value
    /**
     *  set to true to get warning for creating unknown Model type
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    FileSystem.debug = false;
    /**
     * if true, print the IO with the server
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    FileSystem._disp = false;
    /**
     * @private
     * @static
     * @type {NewAlertMsg}
     * @memberof FileSystem
     */
    FileSystem.popup = undefined;
    /**
     * @private
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    FileSystem._cur_tmp_server_id = 0;
    /**
     * if true, eval server response.
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    FileSystem._sig_server = true; // if changes has to be sent
    /**
     * @deprecated
     * @readonly
     * @static
     * @type {(string | number)}
     * @memberof FileSystem
     */
    FileSystem._userid = 644;
    /**
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    FileSystem._timeout_reconnect = 30000;
    /**
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    FileSystem.is_cordova = typeof document !== 'undefined'
        ? document.URL.indexOf('http://') == -1 &&
            document.URL.indexOf('https://') == -1
        : false;
    /**
     * data are sent after a timeout (and are concatened before)
     * @static
     * @type {{ [serverId: number]: Model }}
     * @memberof FileSystem
     */
    FileSystem._objects_to_send = {};
    /**
     * @static
     * @type {ReturnType<typeof setTimeout>}
     * @memberof FileSystem
     */
    FileSystem._timer_send = undefined;
    /**
     * @static
     * @type {ReturnType<typeof setTimeout>}
     * @memberof FileSystem
     */
    FileSystem._timer_chan = undefined;
    /**
     * functions to be called after an answer
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    FileSystem._nb_callbacks = 0;
    /**
     * @static
     * @type {{ [id: number]: SpinalLoadCallBack<Model> }}
     * @memberof FileSystem
     */
    FileSystem._callbacks = {};
    /**
     * @static
     * @type {[string, SpinalLoadCallBack<Model>][]}
     * @memberof FileSystem
     */
    FileSystem._type_callbacks = []; // list of callbacks associated to a type: [ [ "type", function ], ... ]
    /**
     * number of instances of FileSystem
     * @private
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    FileSystem._nb_insts = 0;
    /**
     * @private
     * @static
     * @type {{ [idInstance: number]: FileSystem }}
     * @memberof FileSystem
     */
    FileSystem._insts = {};
    /**
     * ref to Path waiting to be registered before sending data
     * @static
     * @type {{ [key: number]: Path }}
     * @memberof FileSystem
     */
    FileSystem._files_to_upload = {};
    /**
     * Ptr objects that need an update, associated with FileSystem_tmp_objects
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    FileSystem._ptr_to_update = {};
    /**
     * objects waiting for a real _server_id
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    FileSystem._tmp_objects = {};
    /**
     * _server_id -> object
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    FileSystem._objects = {};
    /**
     * @static
     * @type {string}
     * @memberof FileSystem
     */
    FileSystem.url_com = '/sceen/_';
    /**
     * @static
     * @type {string}
     * @memberof FileSystem
     */
    FileSystem.url_upload = '/sceen/upload';
    /**
     * conector type : Browser or Node
     * @static
     * @type {('Node' | 'Browser')}
     * @memberof FileSystem
     */
    FileSystem.CONNECTOR_TYPE = typeof globalThis.global != 'undefined' ? 'Node' : 'Browser';
    /**
     * to be refedifined to change the handleing for connections error
     * @static
     * @memberof FileSystem
     */
    FileSystem.onConnectionError = FileSystem._onConnectionError;
    return FileSystem;
}());
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map