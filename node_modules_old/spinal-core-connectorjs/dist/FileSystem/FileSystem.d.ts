import type { IFsData } from '../interfaces/IFsData';
import type { IOptionFileSystemWithSessionId, IOptionFileSystemWithUser } from '../interfaces/IOptionFilesystem';
import type { SpinalLoadCallBack } from '../interfaces/SpinalLoadCallBack';
import type { Model } from '../Models/Model';
import { Directory } from './Models/Directory';
import type { Path } from './Models/Path';
import type { RightsItem } from './Models/RightsItem';
/**
 * intance of the connection to an server
 * @export
 * @class FileSystem
 */
export declare class FileSystem {
    static _constructorName: string;
    /**
     *  set to true to get warning for creating unknown Model type
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    static debug: boolean;
    /**
     * if true, print the IO with the server
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    static _disp: boolean;
    /**
     * @private
     * @static
     * @type {NewAlertMsg}
     * @memberof FileSystem
     */
    private static popup;
    /**
     * @private
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    private static _cur_tmp_server_id;
    /**
     * if true, eval server response.
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    static _sig_server: boolean;
    /**
     * @deprecated
     * @readonly
     * @static
     * @type {(string | number)}
     * @memberof FileSystem
     */
    static readonly _userid: string | number;
    /**
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    static _timeout_reconnect: number;
    /**
     * @static
     * @type {boolean}
     * @memberof FileSystem
     */
    static is_cordova: boolean;
    /**
     * data are sent after a timeout (and are concatened before)
     * @static
     * @type {{ [serverId: number]: Model }}
     * @memberof FileSystem
     */
    static _objects_to_send: {
        [serverId: number]: Model;
    };
    /**
     * @static
     * @type {ReturnType<typeof setTimeout>}
     * @memberof FileSystem
     */
    static _timer_send: ReturnType<typeof setTimeout>;
    /**
     * @static
     * @type {ReturnType<typeof setTimeout>}
     * @memberof FileSystem
     */
    static _timer_chan: ReturnType<typeof setTimeout>;
    /**
     * functions to be called after an answer
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    static _nb_callbacks: number;
    /**
     * @static
     * @type {{ [id: number]: SpinalLoadCallBack<Model> }}
     * @memberof FileSystem
     */
    static _callbacks: {
        [id: number]: SpinalLoadCallBack<Model>;
    };
    /**
     * @static
     * @type {[string, SpinalLoadCallBack<Model>][]}
     * @memberof FileSystem
     */
    static _type_callbacks: [string, SpinalLoadCallBack<Model>][];
    /**
     * number of instances of FileSystem
     * @private
     * @static
     * @type {number}
     * @memberof FileSystem
     */
    private static _nb_insts;
    /**
     * @private
     * @static
     * @type {{ [idInstance: number]: FileSystem }}
     * @memberof FileSystem
     */
    private static _insts;
    /**
     * ref to Path waiting to be registered before sending data
     * @static
     * @type {{ [key: number]: Path }}
     * @memberof FileSystem
     */
    static _files_to_upload: {
        [key: number]: Path;
    };
    /**
     * Ptr objects that need an update, associated with FileSystem_tmp_objects
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    static _ptr_to_update: {
        [key: number]: Model;
    };
    /**
     * objects waiting for a real _server_id
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    static _tmp_objects: {
        [key: number]: Model;
    };
    /**
     * _server_id -> object
     * @static
     * @type {{ [key: number]: Model }}
     * @memberof FileSystem
     */
    static _objects: {
        [key: number]: Model;
    };
    /**
     * @private
     * @type {string}
     * @memberof FileSystem
     */
    private _url;
    /**
     * @private
     * @type {(string | number)}
     * @memberof FileSystem
     */
    private _port;
    /**
     * @type {string}
     * @memberof FileSystem
     */
    _home_dir: string;
    /**
     * @private
     * @type {string}
     * @memberof FileSystem
     */
    private _accessToken;
    /**
     * @static
     * @type {string}
     * @memberof FileSystem
     */
    static url_com: string;
    /**
     * @static
     * @type {string}
     * @memberof FileSystem
     */
    static url_upload: string;
    /**
     * conector type : Browser or Node
     * @static
     * @type {('Node' | 'Browser')}
     * @memberof FileSystem
     */
    static CONNECTOR_TYPE: 'Node' | 'Browser';
    _protocol: string;
    _data_to_send: string;
    _session_num: number;
    _num_inst: number;
    make_channel_error_timer: number;
    static _XMLHttpRequest: any;
    /**
     * Creates an instance of FileSystem.
     * @param {IOptionFileSystemWithSessionId} {
     *     protocol,
     *     url,
     *     port,
     *     home_dir,
     *     sessionId,
     *     accessToken,
     *   }
     * @memberof FileSystem
     */
    constructor({ protocol, url, port, home_dir, sessionId, accessToken, }: IOptionFileSystemWithSessionId);
    /**
     * Creates an instance of FileSystem.
     * @param {IOptionFileSystemWithUser} {
     *     protocol,
     *     url,
     *     port,
     *     userid,
     *     password,
     *     home_dir,
     *     accessToken,
     *   }
     * @memberof FileSystem
     */
    constructor({ protocol, url, port, userid, password, home_dir, accessToken, }: IOptionFileSystemWithUser);
    /**
     * load object in $path and call $callback with the corresponding model ref
     * @param {string} path
     * @return {*}  {Promise<Directory>}
     * @memberof FileSystem
     */
    load(path: string): Promise<Directory>;
    /**
     * load object in $path and call $callback with the corresponding model ref
     * @template T
     * @param {string} path
     * @param {SpinalLoadCallBack<T>} callback
     * @memberof FileSystem
     */
    load(path: string, callback: SpinalLoadCallBack<Directory>): void;
    /**
     * load all the objects of $type
     * @template T
     * @param {string} type
     * @param {SpinalLoadCallBack<T>} callback
     * @memberof FileSystem
     */
    load_type<T extends Model>(type: string, callback: SpinalLoadCallBack<T>): void;
    private load_or_make_dirProm;
    /**
     * make dir if not already present in the server. Call callback
     * as in the @load proc -- when done (i.e. when loaded or created)
     * @param {string} dir
     * @return {*}  {Promise<Directory>}
     * @memberof FileSystem
     */
    load_or_make_dir(dir: string): Promise<Directory>;
    /**
     * make dir if not already present in the server. Call callback
     * as in the @load proc -- when done (i.e. when loaded or created)
     * @param {string} dir
     * @param {SpinalLoadCallBack<Directory>} callback
     * @memberof FileSystem
     */
    load_or_make_dir(dir: string, callback: SpinalLoadCallBack<Directory>): void;
    /**
     * load an object using is pointer and call $callback with the corresponding ref
     * @template T
     * @param {number} ptr
     * @return {*}  {Promise<T>}
     * @memberof FileSystem
     */
    load_ptr<T extends Model>(ptr: number): Promise<T>;
    /**
     * load an object using is pointer and call $callback with the corresponding ref
     * @template T
     * @param {number} ptr
     * @param {SpinalLoadCallBack<T>} callback
     * @memberof FileSystem
     */
    load_ptr<T extends Model>(ptr: number, callback: SpinalLoadCallBack<T>): void;
    load_right(ptr: number): Promise<RightsItem>;
    load_right(ptr: number, callback: SpinalLoadCallBack<RightsItem>): void;
    /**
     * @param {(Model | number)} ptr
     * @param {string} file_name
     * @param {number} share_type
     * @param {string} targetName
     * @memberof FileSystem
     */
    share_model(ptr: Model | number, file_name: string, share_type: number, targetName: string): void;
    /**
     * explicitly send a command
     * @private
     * @param {string} data
     * @memberof FileSystem
     */
    private send;
    /**
     * send a request for a "push" channel
     * @private
     * @memberof FileSystem
     */
    private make_channel;
    /**
     * to be refedifined to change the handleing for connections error
     * @static
     * @memberof FileSystem
     */
    static onConnectionError: (error_code: number) => void;
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
    private static _onConnectionError;
    /**
     * get the first running inst
     * @static
     * @return {*}  {FileSystem}
     * @memberof FileSystem
     */
    static get_inst(): FileSystem;
    /**
     * @static
     * @param {IFsData} out
     * @param {Model} obj
     * @memberof FileSystem
     */
    static set_server_id_if_necessary(out: IFsData, obj: Model): void;
    /**
     * send changes of m to instances.
     * @static
     * @param {Model} m
     * @memberof FileSystem
     */
    static signal_change(m: Model): void;
    /**
     * @static
     * @param {number} tmp_id
     * @param {number} res
     * @return {*}  {void}
     * @memberof FileSystem
     */
    static _tmp_id_to_real(tmp_id: number, res: number): void;
    private static _create_model_by_name;
    /**
     * @deprecated
     * @static
     * @param {*} _child
     * @param {*} _parent
     * @return {*}  {*}
     * @memberof FileSystem
     */
    static extend(_child: any, _parent: any): any;
    /**
     * @private
     * @static
     * @return {*}  {number}
     * @memberof FileSystem
     */
    private static _get_new_tmp_server_id;
    /**
     * send changes
     * @private
     * @static
     * @memberof FileSystem
     */
    private static _send_chan;
    /**
     * timeout for at least one changed object
     * @private
     * @static
     * @memberof FileSystem
     */
    private static _timeout_chan_func;
    /**
     * get data of objects to send
     * @private
     * @static
     * @return {*}  {string}
     * @memberof FileSystem
     */
    private static _get_chan_data;
    /**
     * @private
     * @static
     * @memberof FileSystem
     */
    private static _timeout_send_func;
    /**
     * @static
     * @return {*}  {*}
     * @memberof FileSystem
     */
    static _my_xml_http_request(): any;
}
