"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketLogsService = void 0;
const spinal_service_pubsub_logs_1 = require("spinal-service-pubsub-logs");
const SpinalQueue_1 = require("../utils/SpinalQueue");
const _1 = require(".");
const constant_1 = require("../constant");
class WebsocketLogsService {
    static _instance;
    _alertTime = parseInt(process.env.WEBSOCKET_ALERT_TIME) || 60 * 1000;
    timeoutIds = {};
    _directory;
    _spinalQueue = new SpinalQueue_1.SpinalQueue();
    _logPromMap = new Map();
    _lastSendTime;
    _io;
    context;
    constructor() { }
    static getInstance() {
        if (!this._instance)
            this._instance = new WebsocketLogsService();
        return this._instance;
    }
    setIo(io) {
        this._io = io;
    }
    async init() {
        this.context = await _1.configServiceInstance.getContext(constant_1.WEBSOCKET_LOG_CONTEXT_NAME);
        if (!this.context) {
            this.context = await _1.configServiceInstance.addContext(constant_1.WEBSOCKET_LOG_CONTEXT_NAME, constant_1.WEBSOCKET_LOG_CONTEXT_TYPE);
        }
        this._listenSpinalQueueEvent();
        return this.context;
    }
    createLog(type, action, targetInfo, nodeInfo) {
        const contextId = this.context.getId().get();
        this._lastSendTime = Date.now();
        clearTimeout(this.timeoutIds[contextId]);
        this._addLogs(type, action, targetInfo, nodeInfo);
        this._startTimer();
    }
    async getClientConnected() {
        const sockets = await this._io.of(`/`).fetchSockets();
        let count = sockets?.length || 0;
        return { numberOfClientConnected: count };
    }
    ///////////////////////////////
    // SpinalLog
    //////////////////////////////
    async getLogModel() {
        const contextId = this.context.getId().get();
        if (this._logPromMap.has(contextId))
            return this._logPromMap.get(contextId);
        const spinalLog = await spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getLog(this.context);
        if (!spinalLog)
            return;
        this._logPromMap.set(contextId, spinalLog);
        return spinalLog;
    }
    async getWebsocketState() {
        const spinalLog = await this.getLogModel();
        if (!spinalLog)
            return { state: spinal_service_pubsub_logs_1.WEBSOCKET_STATE.unknow, since: 0 };
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
    }
    async getCurrent() {
        const spinalLog = await this.getLogModel();
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getCurrent(spinalLog);
    }
    async getDataFromLast24Hours() {
        const spinalLog = await this.getLogModel();
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
    }
    async getDataFromLastHours(numberOfHours) {
        const spinalLog = await this.getLogModel();
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLastHours(spinalLog, numberOfHours);
    }
    async getDataFromYesterday() {
        const spinalLog = await this.getLogModel();
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
    }
    async getFromIntervalTime(start, end) {
        const spinalLog = await this.getLogModel();
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getFromIntervalTime(spinalLog, start, end);
    }
    ////////////////////////////////////////////////
    //             PRIVATE                        //
    ////////////////////////////////////////////////
    _startTimer() {
        const contextId = this.context.getId().get();
        this.timeoutIds[contextId] = setTimeout(() => {
            this._createAlert();
            // this._startTimer(building);
        }, this._alertTime);
    }
    _createAlert() {
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
    async _addLogs(logType, action, targetInfo, nodeInfo) {
        const log = { targetInfo, type: logType, action, nodeInfo };
        console.log('log', log);
        this._addToQueue(log);
    }
    _addToQueue(log) {
        this._spinalQueue.addToQueue(log);
    }
    async _createLogsInGraph() {
        while (!this._spinalQueue.isEmpty()) {
            const log = this._spinalQueue.dequeue();
            const actualState = log.type.toLowerCase() === 'alert'
                ? spinal_service_pubsub_logs_1.WEBSOCKET_STATE.alert
                : spinal_service_pubsub_logs_1.WEBSOCKET_STATE.running;
            await spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().pushFromNode(this.context, log);
            await this._changeBuildingState(actualState);
        }
    }
    async _changeBuildingState(actualState) {
        const spinalLog = await this.getLogModel();
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().changeWebsocketState(spinalLog, actualState);
    }
    _getDirectory(connect) {
        return new Promise((resolve, reject) => {
            if (this._directory)
                return resolve(this._directory);
            connect.load_or_make_dir('/etc/logs', (directory) => {
                this._directory = directory;
                resolve(directory);
            });
        });
    }
    _fileExistInDirectory(directory, fileName) {
        for (let i = 0; i < directory.length; i++) {
            const element = directory[i];
            if (element.name?.get() === fileName)
                return element;
        }
    }
    _listenSpinalQueueEvent() {
        this._spinalQueue.on('start', () => {
            this._createLogsInGraph();
        });
    }
}
exports.default = WebsocketLogsService;
exports.WebsocketLogsService = WebsocketLogsService;
//# sourceMappingURL=webSocketLogs.service.js.map