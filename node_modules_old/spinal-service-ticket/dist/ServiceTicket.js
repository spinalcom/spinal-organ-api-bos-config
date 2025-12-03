"use strict";
/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTicket = void 0;
const Constants_1 = require("./Constants");
const Errors_1 = require("./Errors");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const SpinalLogTicket_1 = require("spinal-models-ticket/dist/SpinalLogTicket");
const SpinalTicket_1 = require("spinal-models-ticket/dist/SpinalTicket");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const moment = require("moment");
class ServiceTicket {
    constructor() { }
    //////////////////////////////////////////////////////////
    //                      CONTEXTS                        //
    //////////////////////////////////////////////////////////
    createContext(contextName, steps = new Array(), contextSubType = 'Ticket') {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(contextName, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            const stepsModel = new spinal_core_connectorjs_type_1.Lst(steps);
            context.info.add_attr('steps', new spinal_core_connectorjs_type_1.Ptr(stepsModel));
            if (Constants_1.TICKET_CONTEXT_SUBTYPE_LIST.includes(contextSubType)) {
                context.info.add_attr('subType', contextSubType);
            }
            return context;
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
    }
    getContexts(name) {
        const contexts = spinal_env_viewer_graph_service_1.SpinalGraphService.getContextWithType(Constants_1.SERVICE_TYPE);
        if (name && name.trim().length > 0) {
            const found = contexts.find((el) => el.getName().get() === name);
            return found ? found.info.get() : undefined;
        }
        return contexts.map((el) => el.info.get());
    }
    updateContexts(contextId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newInfo.name && newInfo.name.trim().length === 0)
                throw new Error('Context name must have at less 1 character');
            const contextNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
            if (contextNode) {
                if (newInfo.name && newInfo.name.trim().length > 0)
                    contextNode.info.name.set(newInfo.name);
                if (!newInfo.steps || newInfo.steps.length > 0)
                    return;
                const oldSteps = yield this.getContextSteps(contextId);
                const stepsSorted = this.sortStepByOrder(newInfo.steps);
            }
        });
    }
    //////////////////////////////////////////////////////////
    //                      PROCESS                         //
    //////////////////////////////////////////////////////////
    createProcess(process, contextId) {
        if (typeof process === 'string')
            process = { name: process };
        process.type = Constants_1.PROCESS_TYPE;
        const processId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(process, undefined);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(contextId, processId, contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getContextSteps(contextId);
            const promises = steps.map((step) => this.createStepNode(step.name, step.color, step.order, processId, contextId));
            yield Promise.all([
                ...promises,
                this.createArchivedStep(processId, contextId),
            ]);
            return processId;
        }))
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
        });
    }
    getAllProcess(contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(contextId, contextId);
    }
    //////////////////////////////////////////////////////////
    //                      STEPS                           //
    //////////////////////////////////////////////////////////
    addStep(processId, contextId, name, color, order) {
        return __awaiter(this, void 0, void 0, function* () {
            if (order < 0)
                return Promise.reject(Error(Errors_1.STEP_ORDER_NOT_VALID));
            return this.getStepsFromProcess(processId, contextId).then((steps) => {
                const max = Math.max(...steps.map((el) => el.order.get()));
                if (order != 0 && !order)
                    order = max + 1;
                if (order > max && max - order > 1)
                    return Promise.reject(Error(Errors_1.STEP_ORDER_NOT_VALID));
                if (order >= 0 && order <= max) {
                    return this.insertStep(contextId, processId, { name, color, order });
                }
                else {
                    return this.createStepNode(name, color, order, processId, contextId);
                }
            });
        });
    }
    removeStep(processId, contextId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const stepInfo = SpinalGraphService.getInfo(stepId).get();
            const step = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(stepId);
            const stepInfo = step.info;
            return this.getSuperiorsSteps(contextId, processId, stepInfo.order, true).then((steps) => __awaiter(this, void 0, void 0, function* () {
                spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(stepId);
                for (const step of steps) {
                    const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(step.id);
                    realNode.info.order.set(step.order - 1);
                }
                return stepId;
            }));
        });
    }
    addStepById(stepId, processId, contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(processId, stepId, contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
            return this.modifyStepProcessId(stepId, processId);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
    getStepsFromProcess(processId, contextId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findInContext(processId, contextId, (node) => {
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
            return node.getType().get() === Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE;
        });
        // .then(nodes => {
        //     return SpinalGraphService.getChildren(node.id.get(),
        //         [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
        // });
    }
    getFirstStep(processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId, contextId);
            let first = steps.find((el) => el.order.get() == 0);
            if (first)
                return first.id.get();
            let stepId = yield this.createStep('declared', '#ff0000', 0);
            yield this.addStepById(stepId, processId, contextId);
            return stepId;
        });
    }
    getNextStep(processId, stepId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId, contextId);
            if (steps) {
                const step = steps.find((el) => el.id.get() === stepId);
                if (step && step.order.get() !== -1) {
                    const nextOrder = parseInt(step.order.get()) + 1;
                    return steps.find((el) => el.order.get() == nextOrder);
                }
            }
        });
    }
    getPreviousStep(processId, stepId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = yield this.getStepsFromProcess(processId, contextId);
            if (steps) {
                const step = steps.find((el) => el.id.get() === stepId);
                if (step && step.order.get() > 0) {
                    const nextOrder = parseInt(step.order.get()) - 1;
                    return steps.find((el) => el.order.get() == nextOrder);
                }
            }
        });
    }
    getSuperiorsSteps(contextId, processId, stepOrder, equals = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getStepsFromProcess(processId, contextId).then((steps) => {
                return steps
                    .filter((step) => {
                    const order = step.order.get();
                    if (equals && order === stepOrder)
                        return true;
                    return order > stepOrder;
                })
                    .map((el) => el.get());
            });
        });
    }
    getInferiorsSteps(contextId, processId, stepOrder, equals = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getStepsFromProcess(processId, contextId).then((steps) => {
                return steps
                    .filter((step) => {
                    const order = step.order.get();
                    if (equals && order === stepOrder)
                        return true;
                    return order < stepOrder;
                })
                    .map((el) => el.get());
            });
        });
    }
    insertStep(contextId, processId, stepInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getSuperiorsSteps(contextId, processId, stepInfo.order, true).then((steps) => __awaiter(this, void 0, void 0, function* () {
                const stepId = yield this.createStepNode(stepInfo.name, stepInfo.color, stepInfo.order, processId, contextId);
                for (const step of steps) {
                    const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(step.id);
                    realNode.info.order.set(step.order + 1);
                }
                return stepId;
            }));
        });
    }
    //////////////////////////////////////////////////////////
    //                      TICKETS                         //
    //////////////////////////////////////////////////////////
    addTicket(ticketInfo, processId, contextId, nodeId, ticketType = 'Ticket') {
        return __awaiter(this, void 0, void 0, function* () {
            const stepId = yield this.getFirstStep(processId, contextId);
            ticketInfo.processId = processId;
            ticketInfo.stepId = stepId;
            ticketInfo.contextId = contextId;
            const ticketId = yield this.createTicket(ticketInfo);
            if (ticketType == 'Alarm') {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(nodeId, ticketId, Constants_1.ALARM_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                yield this.modifyTicketStepId(ticketId, stepId);
                const userInfo = ticketInfo.user ? ticketInfo.user : {};
                yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.creation, userInfo, stepId);
                return ticketId;
            }
            else {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(nodeId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
                yield this.modifyTicketStepId(ticketId, stepId);
                const userInfo = ticketInfo.user ? ticketInfo.user : {};
                yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.creation, userInfo, stepId);
                return ticketId;
            }
        });
    }
    getTicketsFromNode(nodeId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [
            Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        ]).then((children) => children.map((el) => el.get()));
    }
    getAlarmsFromNode(nodeId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.ALARM_RELATION_NAME]).then((children) => children.map((el) => el.get()));
    }
    getTicketsFromStep(stepId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(stepId).then((node) => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id.get(), [
                Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
            ]);
        });
    }
    moveTicket(ticketId, stepFromId, stepToId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ticketId === 'undefined' ||
                typeof stepFromId === 'undefined' ||
                typeof stepToId === 'undefined') {
                return;
            }
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepToId);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, {
                stepId: stepToId,
            });
            return spinal_env_viewer_graph_service_1.SpinalGraphService.moveChildInContext(stepFromId, stepToId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
        });
    }
    moveTicketToNextStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // const ticketInfo = SpinalGraphService.getInfo(ticketId);
            const ticket = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const ticketInfo = ticket.info;
            if (ticketInfo) {
                const stepId = ticketInfo.stepId.get();
                const nextStep = yield this.getNextStep(processId, stepId, contextId);
                if (nextStep) {
                    return this.moveTicket(ticketId, stepId, nextStep.id.get(), contextId).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.moveToNext, userInfo, stepId, nextStep.id.get());
                        return nextStep.get();
                    }));
                }
            }
        });
    }
    moveTicketToPreviousStep(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // const ticketInfo = SpinalGraphService.getInfo(ticketId);
            const ticket = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const ticketInfo = ticket.info;
            if (ticketInfo) {
                const stepId = ticketInfo.stepId.get();
                const previousStep = yield this.getPreviousStep(processId, stepId, contextId);
                if (previousStep) {
                    return this.moveTicket(ticketId, stepId, previousStep.id.get(), contextId).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.moveToPrevious, userInfo, stepId, previousStep.id.get());
                        return previousStep.get();
                    }));
                }
            }
        });
    }
    ArchiveTickets(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const archiveId = yield this.createArchivedStep(processId, contextId);
            // const ticketInfo = SpinalGraphService.getInfo(ticketId);
            const ticket = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const ticketInfo = ticket.info;
            if (ticketInfo && archiveId) {
                const fromId = ticketInfo.stepId.get();
                yield this.moveTicket(ticketId, fromId, archiveId, contextId);
                yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.archived, userInfo, fromId, archiveId);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(archiveId).get();
            }
        });
    }
    unarchiveTicket(contextId, processId, ticketId, userInfo = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // const ticketInfo = SpinalGraphService.getInfo(ticketId);
            const ticket = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const ticketInfo = ticket.info;
            const firstStep = yield this.getFirstStep(processId, contextId);
            if (ticketInfo && firstStep) {
                const fromId = ticketInfo.stepId.get();
                yield this.moveTicket(ticketId, fromId, firstStep, contextId);
                yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.unarchive, userInfo, fromId, firstStep);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(firstStep).get();
            }
        });
    }
    unlinkTicketToProcess(ticketId) { }
    getTicketContextId(ticketId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
        if (realNode) {
            return realNode.contextIds._attribute_names.find((id) => {
                const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
                if (!node)
                    return false;
                return node.getType().get() === Constants_1.SERVICE_TYPE;
            });
        }
    }
    changeTicketProcess(ticketId, newProcessId, newContextId) {
        return __awaiter(this, void 0, void 0, function* () {
            // let ticketInfo = SpinalGraphService.getInfo(ticketId);
            const ticket = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const ticketInfo = ticket.info;
            let oldContextId = this.getTicketContextId(ticketId);
            const contextId = newContextId || oldContextId;
            const stepId = yield this.getFirstStep(newProcessId, contextId);
            const oldStepId = yield this.getOldStepId(ticketInfo.get(), oldContextId);
            if (contextId === oldContextId) {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.moveChildInContext(oldStepId, stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            }
            else {
                yield this.removeFromContextId(ticketId, oldStepId, oldContextId);
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(stepId, ticketId, contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            }
            yield this.modifyTicketStepId(ticketId, stepId);
            const userInfo = ticketInfo && ticketInfo.user ? ticketInfo.user.get() : {};
            yield this.addLogToTicket(ticketId, Constants_1.LOGS_EVENTS.creation, userInfo, stepId);
            return ticketId;
        });
    }
    changeTicketElementNode(ticketId, newElementId) {
        return __awaiter(this, void 0, void 0, function* () {
            const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
            const parents = yield realNode.getParents(Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
            const promises = parents.map((parent) => {
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(parent);
                const id = parent.getId().get();
                return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(id, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            });
            yield Promise.all(promises);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(newElementId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            return ticketId;
        });
    }
    //////////////////////////////////////////////////////////
    //                      LOGS                            //
    //////////////////////////////////////////////////////////
    addLogToTicket(ticketId, event, userInfo = {}, fromId, toId) {
        let info = {
            ticketId: ticketId,
            event: event,
            action: Constants_1.EVENTS_TO_LOG[event],
            user: userInfo,
            steps: [],
        };
        if (fromId)
            info.steps.push(fromId);
        if (toId)
            info.steps.push(toId);
        const logId = this.createLog(info);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(ticketId, logId, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE);
    }
    createLog(info) {
        const logId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: 'log',
            type: Constants_1.SERVICE_LOG_TYPE,
        }, new SpinalLogTicket_1.SpinalLogTicket(info));
        return logId;
    }
    getLogs(ticketId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(ticketId, [
            Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
        ]).then((logs) => {
            const promises = logs.map((el) => el.element.load());
            return Promise.all(promises).then((elements) => {
                return elements.map((el) => {
                    const res = el.get();
                    if (typeof res.action == 'undefined')
                        res.action = Constants_1.EVENTS_TO_LOG[res.event];
                    return res;
                });
            });
        });
    }
    //////////////////////////////////////////////////////////
    //                      COMMON INCIDENT                 //
    //////////////////////////////////////////////////////////
    addCommonIncident(processId, sentence) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(processId, [
            Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
        ]).then((children) => {
            if (children.length > 0) {
                const sectionId = children[0].id.get();
                const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                    name: sentence,
                    type: Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
                }, undefined);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(sectionId, sentenceId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE).then(() => {
                    return sentenceId;
                });
            }
            return this.addSentenceSection(processId).then((bool) => {
                if (bool) {
                    return this.addCommonIncident(processId, sentence);
                }
            });
        });
    }
    getCommonIncident(processId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(processId, [
                Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
            ]);
            if (children && children.length > 0) {
                const sectionId = children[0].id.get();
                const sentences = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sectionId, [
                    Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
                ]);
                return sentences.map((el) => el.get());
            }
            return [];
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //                                              PRIVATE                                         //
    //////////////////////////////////////////////////////////////////////////////////////////////////
    modifyStepProcessId(stepId, processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(stepId, { processId });
    }
    modifyTicketStepId(ticketId, stepId) {
        return __awaiter(this, void 0, void 0, function* () {
            const step = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(stepId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode(ticketId, { stepId });
        });
    }
    createTicket(elementInfo, infoNode) {
        let infoNodeRef = infoNode;
        if (!infoNodeRef) {
            infoNodeRef = elementInfo;
        }
        infoNodeRef.type = Constants_1.SPINAL_TICKET_SERVICE_TICKET_TYPE;
        if (!infoNodeRef.declarer_id)
            infoNodeRef.declarer_id = 'unknow';
        const ticket = new SpinalTicket_1.SpinalTicket(elementInfo);
        const ticketId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(infoNodeRef, ticket);
        // this.tickets.add(ticketId);
        return this.createAttribute(ticketId, elementInfo).then(() => ticketId);
    }
    createAttribute(ticketId, elementInfo) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
        const categoryName = 'default';
        return spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation
            .addCategoryAttribute(node, categoryName)
            .then((attributeCategory) => {
            const promises = [];
            if (node) {
                const attributes = Object.keys(elementInfo);
                for (const element of attributes) {
                    promises.push(spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addAttributeByCategory(node, attributeCategory, element, this.getObjData(element, node.info[element])));
                }
                promises.push(spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addAttributeByCategory(node, attributeCategory, Constants_1.TICKET_ATTRIBUTE_OCCURENCE_NAME, '0', 'number'));
                return Promise.all(promises);
            }
        });
    }
    createStep(name, color, order, processId) {
        // this.stepOrderIsValid(processId, order);
        const stepId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name,
            color,
            order,
            type: Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE,
        }, undefined);
        // this.steps.add(stepId);
        return stepId;
    }
    getContextSteps(contextId) {
        const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        if (realNode && realNode.info.steps) {
            return new Promise((resolve, reject) => {
                realNode.info.steps.load((stepsLst) => {
                    const steps = stepsLst.get();
                    resolve(steps);
                });
            });
        }
        return Promise.resolve([]);
    }
    addSentenceSection(processId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(processId, [
            Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
        ]).then((children) => {
            if (children.length > 0) {
                return Promise.reject(Errors_1.DEFAULT_SENTENCE_SECTION_ALREADY_EXIST);
            }
            const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                processId,
                name: Constants_1.DEFAULT_INCIDENTS_NAME,
                type: Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(processId, sentenceId, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE)
                .then((e) => {
                return Promise.resolve(true);
            })
                .catch((e) => {
                return Promise.reject(e);
            });
        });
    }
    getObjData(key, valueModel) {
        switch (key) {
            case 'name':
                return valueModel;
            case 'priority':
                const found = Object.keys(Constants_1.TICKET_PRIORITIES).find((el) => Constants_1.TICKET_PRIORITIES[el] == valueModel.get());
                return found ? found : '-';
            case 'user':
                return valueModel && valueModel.name
                    ? valueModel.name.get()
                    : valueModel.username
                        ? valueModel.username.get()
                        : 'unknown';
            case 'creationDate':
                return moment(valueModel.get()).format('MMMM Do YYYY, h:mm:ss a');
            default:
                return valueModel ? valueModel.get() : '';
        }
    }
    createArchivedStep(processId, contextId) {
        return this.getStepsFromProcess(processId, contextId).then((result) => {
            const found = result.find((el) => el.name.get() === Constants_1.ARCHIVED_STEP.name &&
                el.order.get() === Constants_1.ARCHIVED_STEP.order);
            if (found)
                return found.id.get();
            return this.createStepNode(Constants_1.ARCHIVED_STEP.name, Constants_1.ARCHIVED_STEP.color, Constants_1.ARCHIVED_STEP.order, processId, contextId);
        });
    }
    createStepNode(name, color, order, processId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepId = yield this.createStep(name, color, order, processId);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(processId, stepId, contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield this.modifyStepProcessId(stepId, processId);
                return stepId;
            }))
                .catch((e) => {
                return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
            });
        });
    }
    sortStepByOrder(steps) {
        const stepsSorted = [...steps].sort((a, b) => a.order - b.order);
        for (let index = 0; index < stepsSorted.length; index++) {
            stepsSorted[index].order = index;
        }
        return stepsSorted;
    }
    removeFromContextId(ticketId, oldStepId, oldContextId) {
        return __awaiter(this, void 0, void 0, function* () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(oldStepId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE).then((result) => {
                const realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketId);
                try {
                    realNode.contextIds.delete(oldContextId);
                    return true;
                }
                catch (error) {
                    return false;
                }
            });
        });
    }
    getOldStepId(ticketInfo, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepId = ticketInfo.stepId;
            const step = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(stepId);
            const stepInfo = step.info;
            if (stepInfo)
                return stepId;
            let id2;
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.findInContext(contextId, contextId, (node) => {
                if (node.getId().get() === stepId) {
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
                    id2 = node.getId().get();
                    return true;
                }
                return false;
            });
            return id2;
        });
    }
    getTicketsFromArchive(processOrSpatialNode, begin, end) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const res = [];
            try {
                for (var _d = true, _e = __asyncValues(this.getTicketsFromArchiveGen(processOrSpatialNode, begin, end)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const ticket = _c;
                        res.push(ticket);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return res;
        });
    }
    getTicketsFromArchiveGen(processOrSpatialNode, begin, end) {
        var _a, _b;
        return __asyncGenerator(this, arguments, function* getTicketsFromArchiveGen_1() {
            processOrSpatialNode =
                typeof processOrSpatialNode === 'string'
                    ? spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(processOrSpatialNode)
                    : processOrSpatialNode;
            const tsBegin = moment(begin).valueOf();
            const tsEnd = moment(end).valueOf();
            const isProcess = processOrSpatialNode.info.type.get() === Constants_1.PROCESS_TYPE;
            const timeStampAttr = isProcess
                ? Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
                : Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
            const relationName = isProcess
                ? Constants_1.PROCESS_ARCHIVE_TICKET_RELATION
                : Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION;
            const archiveTicketType = isProcess
                ? Constants_1.PROCESS_ARCHIVE_TICKET_TYPE
                : Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE;
            const archiveTicketNode = yield __await(this.getArchive(processOrSpatialNode, relationName, archiveTicketType));
            const archiveParts = yield __await(this.getAchivePartsFromArchive(archiveTicketNode));
            for (const archivePart of archiveParts) {
                if (archivePart.info.end.get() < tsBegin ||
                    archivePart.info.start.get() > tsEnd)
                    continue;
                const tickets = yield __await(archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION));
                for (const ticket of tickets) {
                    if (((_a = ticket.info[timeStampAttr]) === null || _a === void 0 ? void 0 : _a.get()) >= tsBegin &&
                        ((_b = ticket.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get()) <= tsEnd) {
                        yield yield __await(ticket);
                    }
                }
            }
        });
    }
    deleteTicketFromArchive(processOrSpatialNode, begin, end) {
        return __awaiter(this, void 0, void 0, function* () {
            processOrSpatialNode =
                typeof processOrSpatialNode === 'string'
                    ? spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(processOrSpatialNode)
                    : processOrSpatialNode;
            if (!processOrSpatialNode)
                throw new Error("deleteTicketFromArchive process or spatial node ID given don't exist in graph service.");
            const isProcess = processOrSpatialNode.info.type.get() === Constants_1.PROCESS_TYPE;
            const timeStampAttr = isProcess
                ? Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
                : Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
            const relationName = isProcess
                ? Constants_1.PROCESS_ARCHIVE_TICKET_RELATION
                : Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION;
            const archiveTicketType = isProcess
                ? Constants_1.PROCESS_ARCHIVE_TICKET_TYPE
                : Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE;
            const tsBegin = moment(begin).valueOf();
            const tsEnd = moment(end).valueOf();
            const archiveTicketNode = yield this.getArchive(processOrSpatialNode, relationName, archiveTicketType);
            const archiveParts = yield this.getAchivePartsFromArchive(archiveTicketNode);
            for (const archivePart of archiveParts) {
                if (archivePart.info.end.get() < tsBegin ||
                    archivePart.info.start.get() > tsEnd)
                    continue;
                const tickets = yield archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION);
                const ticketsToRm = tickets.filter((ticket) => {
                    var _a, _b;
                    return ((_a = ticket.info[timeStampAttr]) === null || _a === void 0 ? void 0 : _a.get()) >= tsBegin &&
                        ((_b = ticket.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get()) <= tsEnd;
                });
                try {
                    yield archivePart.removeChildren(ticketsToRm, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
                }
                catch (error) { }
                ticketsToRm.forEach((ticket) => ticket.setIndirectModificationDate(Date.now()));
                yield this.updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr);
            }
        });
    }
    updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION);
            if (tickets.length === 0) {
                yield archiveTicketNode.removeChild(archivePart, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
            }
            else {
                const start = (_b = (_a = tickets[0]) === null || _a === void 0 ? void 0 : _a.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get();
                const end = (_d = (_c = tickets[tickets.length - 1]) === null || _c === void 0 ? void 0 : _c.info[timeStampAttr]) === null || _d === void 0 ? void 0 : _d.get();
                archivePart.info.start.set(start);
                archivePart.info.end.set(end);
                archivePart.info.name.set(this.getArchivePartNameDate(start, end));
            }
        });
    }
    archiveTicketFromProcess(ticketNode, processNode, date, maxArchiveSize = 200) {
        return this.archiveTicket(ticketNode, processNode, date, maxArchiveSize, Constants_1.PROCESS_ARCHIVE_TICKET_RELATION, Constants_1.PROCESS_ARCHIVE_TICKET_TYPE, [Constants_1.STEP_TYPE], Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS);
    }
    archiveTicketFromSpatial(ticketNode, spatialNode, date, maxArchiveSize = 200) {
        return this.archiveTicket(ticketNode, spatialNode, date, maxArchiveSize, Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION, Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE, Constants_1.GEO_TYPES, Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL);
    }
    archiveTicket(ticketNode, processOrSpatialNode, date, maxArchiveSize, archiveRelationName, archiveNodeType, parentTypes, timestampAttr) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // make sure we work with spianlNode
            ticketNode =
                typeof ticketNode === 'string'
                    ? spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(ticketNode)
                    : ticketNode;
            processOrSpatialNode =
                typeof processOrSpatialNode === 'string'
                    ? spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(processOrSpatialNode)
                    : processOrSpatialNode;
            if (!processOrSpatialNode) {
                throw new Error("archiveTicket process or spatial node ID given don't exist in graph service.");
            }
            // getOrCreateArchive
            const archiveTicketNode = yield this.getOrCreateArchive(processOrSpatialNode, archiveRelationName, archiveNodeType);
            // getOrCreateArchivePart with date
            const timestamp = moment(date).valueOf();
            const archivePartNode = yield this.getArchivePartFromArchive(archiveTicketNode, Constants_1.ARCHIVE_TICKET_PART_RELATION, Constants_1.ARCHIVE_TICKET_PART_TYPE, timestamp, maxArchiveSize);
            // add ticket to the part
            yield archivePartNode.addChild(ticketNode, Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
            // update part info
            const start = archivePartNode.info.start.get();
            (_a = archivePartNode.info.start) === null || _a === void 0 ? void 0 : _a.set(start);
            (_b = archivePartNode.info.end) === null || _b === void 0 ? void 0 : _b.set(timestamp);
            archivePartNode.info.name.set(this.getArchivePartNameDate(start, timestamp));
            // add archiveTimestamp to ticket node
            if (!ticketNode.info[timestampAttr])
                ticketNode.info.add_attr(timestampAttr, timestamp);
            else
                ticketNode.info[timestampAttr].set(timestamp);
            ticketNode.setIndirectModificationDate(Date.now());
            // remove parent step
            yield this.removeTicketFromParent(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, parentTypes);
        });
    }
    removeTicketFromParent(ticketNode, relationName, parentTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            const parents = yield ticketNode.getParents(relationName);
            const parentsFiltered = parents.filter((parent) => parentTypes.includes(parent.info.type.get()));
            const proms = parentsFiltered.map((parent) => {
                return parent
                    .removeChild(ticketNode, relationName, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
                    .catch(() => console.log(`catch erreor remove child for ${ticketNode.info.name.get()}`));
            });
            yield Promise.all(proms);
        });
    }
    getAchivePartsFromArchive(archive) {
        return (archive.getChildren(Constants_1.ARCHIVE_TICKET_RELATIONS));
    }
    getArchivePartFromArchive(archive, parentRelationName, childNodeType, date, maxArchiveSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield archive.getChildren(parentRelationName);
            const child = children[children.length - 1];
            if (child &&
                child.info.type.get() === childNodeType &&
                maxArchiveSize > child.getNbChildren()) {
                return child;
            }
            const name = this.getArchivePartNameDate(date, date);
            const archivePart = new spinal_env_viewer_graph_service_1.SpinalNode(name, childNodeType);
            const timestamp = moment(date).valueOf();
            archivePart.info.add_attr({
                start: timestamp,
                end: timestamp,
            });
            yield archive.addChild(archivePart, parentRelationName, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
            return archivePart;
        });
    }
    getArchive(node, parentRelationNames, childNodeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield node.getChildren(parentRelationNames);
            for (const child of children) {
                if (child.info.type.get() === childNodeType) {
                    return child;
                }
            }
        });
    }
    getOrCreateArchive(node, parentRelationName, childNodeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield node.getChildren(parentRelationName);
            for (const child of children) {
                if (child.info.type.get() === childNodeType) {
                    return child;
                }
            }
            const archive = new spinal_env_viewer_graph_service_1.SpinalNode(childNodeType, childNodeType);
            yield node.addChild(archive, parentRelationName, Constants_1.ARCHIVE_TICKET_RELATION_TYPE);
            return archive;
        });
    }
    getArchivePartNameDate(start, end) {
        const s = moment(start).format();
        const e = moment(end).format();
        return `${s} - ${e}`;
    }
}
exports.ServiceTicket = ServiceTicket;
//# sourceMappingURL=ServiceTicket.js.map