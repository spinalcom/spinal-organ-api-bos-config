/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import {
  SpinalServiceLog,
  ILog,
  WEBSOCKET_STATE,
  SpinalLog,
} from 'spinal-service-pubsub-logs';

import {
  SpinalContext,
  SpinalGraph,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {SpinalQueue} from '../utils/SpinalQueue';
import {Server} from 'socket.io';
import {configServiceInstance} from '.';
import {
  WEBSOCKET_LOG_CONTEXT_NAME,
  WEBSOCKET_LOG_CONTEXT_TYPE,
} from '../constant';

export default class WebsocketLogsService {
  private static _instance: WebsocketLogsService;
  private _alertTime: number =
    parseInt(process.env.WEBSOCKET_ALERT_TIME) || 60 * 1000;
  private timeoutIds: {[key: string]: any} = {};
  private _directory: spinal.Directory;
  private _spinalQueue: SpinalQueue = new SpinalQueue();
  private _logPromMap: Map<string, SpinalLog> = new Map();
  private _lastSendTime: number;
  private _io: Server;
  private context: SpinalContext;

  private constructor() {}

  public static getInstance(): WebsocketLogsService {
    if (!this._instance) this._instance = new WebsocketLogsService();
    return this._instance;
  }

  public setIo(io: Server) {
    this._io = io;
  }

  public async init() {
    this.context = await configServiceInstance.getContext(
      WEBSOCKET_LOG_CONTEXT_NAME
    );
    if (!this.context) {
      this.context = await configServiceInstance.addContext(
        WEBSOCKET_LOG_CONTEXT_NAME,
        WEBSOCKET_LOG_CONTEXT_TYPE
      );
    }

    this._listenSpinalQueueEvent();
    return this.context;
  }

  public createLog(
    type: string,
    action: string,
    targetInfo?: {id: string; name: string},
    nodeInfo?: {id: string; name: string; [key: string]: string}
  ) {
    const contextId = this.context.getId().get();
    this._lastSendTime = Date.now();

    clearTimeout(this.timeoutIds[contextId]);

    this._addLogs(type, action, targetInfo, nodeInfo);

    this._startTimer();
  }

  public async getClientConnected() {
    const sockets = await (this._io as any).of(`/`).fetchSockets();

    let count = sockets?.length || 0;

    return {numberOfClientConnected: count};
  }

  ///////////////////////////////
  // SpinalLog
  //////////////////////////////

  public async getLogModel(): Promise<SpinalLog> {
    const contextId = this.context.getId().get();
    if (this._logPromMap.has(contextId)) return this._logPromMap.get(contextId);

    const spinalLog = await SpinalServiceLog.getInstance().getLog(this.context);
    if (!spinalLog) return;

    this._logPromMap.set(contextId, spinalLog);
    return spinalLog;
  }

  public async getWebsocketState() {
    const spinalLog = await this.getLogModel();
    if (!spinalLog) return {state: WEBSOCKET_STATE.unknow, since: 0};

    return SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
  }

  public async getCurrent() {
    const spinalLog = await this.getLogModel();
    return SpinalServiceLog.getInstance().getCurrent(spinalLog);
  }

  public async getDataFromLast24Hours() {
    const spinalLog = await this.getLogModel();
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
  }

  public async getDataFromLastHours(numberOfHours: number) {
    const spinalLog = await this.getLogModel();
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLastHours(
      spinalLog,
      numberOfHours
    );
  }

  public async getDataFromYesterday() {
    const spinalLog = await this.getLogModel();
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
  }

  public async getFromIntervalTime(
    start: string | number | Date,
    end: string | number | Date
  ) {
    const spinalLog = await this.getLogModel();
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getFromIntervalTime(
      spinalLog,
      start,
      end
    );
  }

  ////////////////////////////////////////////////
  //             PRIVATE                        //
  ////////////////////////////////////////////////

  private _startTimer() {
    const contextId = this.context.getId().get();
    this.timeoutIds[contextId] = setTimeout(() => {
      this._createAlert();
      // this._startTimer(building);
    }, this._alertTime);
  }

  private _createAlert() {
    //  if (this._websocket[buildingId].state.get() === logTypes.Normal) {
    //    const message = `websocket doesn't send data since ${new Date(
    //      this._lastSendTime
    //    ).toString()}`;
    //    console.log([buildingName], message);
    //    this._websocket[buildingId].state.set(logTypes.Alarm);
    //    this._addLogs(buildingId, message, logTypes.Alarm);
    //  }
    return this._addLogs('Alert', 'alert');
  }

  private async _addLogs(
    logType: string,
    action: string,
    targetInfo?: {id: string; name: string},
    nodeInfo?: {id: string; name: string; [key: string]: string}
  ) {
    const log: ILog = {targetInfo, type: logType, action, nodeInfo};
    console.log('log', log);
    this._addToQueue(log);
  }

  private _addToQueue(log: ILog) {
    this._spinalQueue.addToQueue(log);
  }

  private async _createLogsInGraph() {
    while (!this._spinalQueue.isEmpty()) {
      const log = this._spinalQueue.dequeue();
      const actualState =
        log.type.toLowerCase() === 'alert'
          ? WEBSOCKET_STATE.alert
          : WEBSOCKET_STATE.running;

      await SpinalServiceLog.getInstance().pushFromNode(this.context, log);
      await this._changeBuildingState(actualState);
    }
  }

  private async _changeBuildingState(
    actualState: WEBSOCKET_STATE
  ): Promise<void> {
    const spinalLog = await this.getLogModel();

    return SpinalServiceLog.getInstance().changeWebsocketState(
      spinalLog,
      actualState
    );
  }

  private _getDirectory(connect: spinal.FileSystem): Promise<spinal.Directory> {
    return new Promise((resolve, reject) => {
      if (this._directory) return resolve(this._directory);

      connect.load_or_make_dir('/etc/logs', (directory: spinal.Directory) => {
        this._directory = directory;
        resolve(directory);
      });
    });
  }

  private _fileExistInDirectory(
    directory: spinal.Directory,
    fileName: string
  ): spinal.File {
    for (let i = 0; i < directory.length; i++) {
      const element = directory[i];
      if (element.name?.get() === fileName) return element;
    }
  }

  private _listenSpinalQueueEvent() {
    this._spinalQueue.on('start', () => {
      this._createLogsInGraph();
    });
  }
}

export {WebsocketLogsService};
