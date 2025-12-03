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

import {
  DEFAULT_INCIDENTS_NAME,
  PROCESS_TYPE,
  SERVICE_LOG_TYPE,
  SERVICE_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
  SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
  SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
  SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
  LOGS_EVENTS,
  TICKET_PRIORITIES,
  ARCHIVED_STEP,
  TICKET_ATTRIBUTE_OCCURENCE_NAME,
  EVENTS_TO_LOG,
  TICKET_CONTEXT_SUBTYPE_LIST,
  ALARM_RELATION_NAME,
  TICKET_RELATION_NAME,
  STEP_TYPE,
  STEP_RELATION_NAME,
  GEO_TYPES,
  SPATIAL_ARCHIVE_TICKET_RELATION,
  SPATIAL_ARCHIVE_TICKET_TYPE,
  ARCHIVE_TICKET_RELATION_TYPE,
  ARCHIVE_TICKET_PART_RELATION,
  ARCHIVE_TICKET_PART_TYPE,
  ARCHIVE_TICKET_PART_TICKET_RELATION,
  PROCESS_ARCHIVE_TICKET_RELATION,
  PROCESS_ARCHIVE_TICKET_TYPE,
  ARCHIVE_TICKET_RELATIONS,
  ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS,
  ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL,
} from './Constants';

import {
  CANNOT_ADD_STEP_TO_PROCESS,
  CANNOT_CREATE_CONTEXT_INTERNAL_ERROR,
  CANNOT_CREATE_PROCESS_INTERNAL_ERROR,
  DEFAULT_SENTENCE_SECTION_ALREADY_EXIST,
  STEP_ORDER_NOT_VALID,
} from './Errors';

import {
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';

import {
  SpinalLogTicket,
  SpinalLogTicketInterface,
} from 'spinal-models-ticket/dist/SpinalLogTicket';
import {
  SpinalTicket,
  TicketInterface,
} from 'spinal-models-ticket/dist/SpinalTicket';
import { SpinalProcess } from 'spinal-models-ticket/dist/SpinalProcess';

import { Lst, Ptr } from 'spinal-core-connectorjs_type';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { IUserInfo } from './interfaces/IUserInfo';

import * as moment from 'moment';
import { ISpinalNodeArchivePart } from './interfaces/ISpinalNodePart';

export class ServiceTicket {
  constructor() {}

  //////////////////////////////////////////////////////////
  //                      CONTEXTS                        //
  //////////////////////////////////////////////////////////

  public createContext(
    contextName: string,
    steps: Array<{ name: string; color?: string; order: number }> = new Array(),
    contextSubType: string = 'Ticket'
  ): Promise<any | Error> {
    return SpinalGraphService.addContext(contextName, SERVICE_TYPE, undefined)
      .then((context) => {
        const stepsModel = new Lst(steps);
        context.info.add_attr('steps', new Ptr(stepsModel));
        if (TICKET_CONTEXT_SUBTYPE_LIST.includes(contextSubType)) {
          context.info.add_attr('subType', contextSubType);
        }
        return context;
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
      });
  }

  public getContexts(name?: string): any | any[] {
    const contexts = SpinalGraphService.getContextWithType(SERVICE_TYPE);
    if (name && name.trim().length > 0) {
      const found: any = contexts.find((el) => el.getName().get() === name);
      return found ? found.info.get() : undefined;
    }
    return contexts.map((el) => el.info.get());
  }

  public async updateContexts(
    contextId: string,
    newInfo: {
      name: string;
      steps: Array<{ name: string; color?: string; order: number }>;
    }
  ): Promise<any | Error> {
    if (newInfo.name && newInfo.name.trim().length === 0)
      throw new Error('Context name must have at less 1 character');

    const contextNode = SpinalGraphService.getRealNode(contextId);

    if (contextNode) {
      if (newInfo.name && newInfo.name.trim().length > 0)
        contextNode.info.name.set(newInfo.name);

      if (!newInfo.steps || newInfo.steps.length > 0) return;

      const oldSteps = await this.getContextSteps(contextId);
      const stepsSorted = this.sortStepByOrder(newInfo.steps);
    }
  }

  //////////////////////////////////////////////////////////
  //                      PROCESS                         //
  //////////////////////////////////////////////////////////

  public createProcess(
    process: SpinalProcess | string,
    contextId: string
  ): Promise<string> {
    if (typeof process === 'string') process = { name: process };

    process.type = PROCESS_TYPE;
    const processId = SpinalGraphService.createNode(process, undefined);
    return SpinalGraphService.addChildInContext(
      contextId,
      processId,
      contextId,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE
    )
      .then(async () => {
        const steps = await this.getContextSteps(contextId);

        const promises = steps.map((step) =>
          this.createStepNode(
            step.name,
            step.color,
            step.order,
            processId,
            contextId
          )
        );

        await Promise.all([
          ...promises,
          this.createArchivedStep(processId, contextId),
        ]);

        return processId;
      })
      .catch((e) => {
        console.error(e);
        return Promise.reject(Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
      });
  }

  public getAllProcess(contextId: string) {
    return SpinalGraphService.getChildrenInContext(contextId, contextId);
  }

  //////////////////////////////////////////////////////////
  //                      STEPS                           //
  //////////////////////////////////////////////////////////

  public async addStep(
    processId: string,
    contextId: string,
    name: string,
    color: string,
    order: number
  ): Promise<any | Error> {
    if (order < 0) return Promise.reject(Error(STEP_ORDER_NOT_VALID));

    return this.getStepsFromProcess(processId, contextId).then((steps) => {
      const max = Math.max(...steps.map((el) => el.order.get()));
      if (order != 0 && !order) order = max + 1;
      if (order > max && max - order > 1)
        return Promise.reject(Error(STEP_ORDER_NOT_VALID));

      if (order >= 0 && order <= max) {
        return this.insertStep(contextId, processId, { name, color, order });
      } else {
        return this.createStepNode(name, color, order, processId, contextId);
      }
    });
  }

  public async removeStep(
    processId: string,
    contextId: string,
    stepId: string
  ) {
    // const stepInfo = SpinalGraphService.getInfo(stepId).get();
    const step = SpinalGraphService.getRealNode(stepId);
    const stepInfo = step.info;
    return this.getSuperiorsSteps(
      contextId,
      processId,
      stepInfo.order,
      true
    ).then(async (steps) => {
      SpinalGraphService.removeFromGraph(stepId);

      for (const step of steps) {
        const realNode = SpinalGraphService.getRealNode(step.id);
        realNode.info.order.set(step.order - 1);
      }

      return stepId;
    });
  }

  public addStepById(
    stepId: string,
    processId: string,
    contextId: string
  ): Promise<boolean | Error> {
    return SpinalGraphService.addChildInContext(
      processId,
      stepId,
      contextId,
      SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
      SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE
    )
      .then(() => {
        return this.modifyStepProcessId(stepId, processId);
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
      });
  }

  public getStepsFromProcess(
    processId: string,
    contextId: string
  ): Promise<any> {
    return SpinalGraphService.findInContext(processId, contextId, (node) => {
      (<any>SpinalGraphService)._addNode(node);
      return node.getType().get() === SPINAL_TICKET_SERVICE_STEP_TYPE;
    });
    // .then(nodes => {
    //     return SpinalGraphService.getChildren(node.id.get(),
    //         [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);
    // });
  }

  public async getFirstStep(
    processId: string,
    contextId: string
  ): Promise<string> {
    const steps = await this.getStepsFromProcess(processId, contextId);

    let first = steps.find((el) => el.order.get() == 0);
    if (first) return first.id.get();

    let stepId = await this.createStep('declared', '#ff0000', 0);
    await this.addStepById(stepId, processId, contextId);

    return stepId;
  }

  public async getNextStep(
    processId: string,
    stepId: string,
    contextId: string
  ): Promise<any> {
    const steps = await this.getStepsFromProcess(processId, contextId);
    if (steps) {
      const step = steps.find((el) => el.id.get() === stepId);
      if (step && step.order.get() !== -1) {
        const nextOrder = parseInt(step.order.get()) + 1;
        return steps.find((el) => el.order.get() == nextOrder);
      }
    }
  }

  public async getPreviousStep(
    processId: string,
    stepId: string,
    contextId: string
  ): Promise<any> {
    const steps = await this.getStepsFromProcess(processId, contextId);
    if (steps) {
      const step = steps.find((el) => el.id.get() === stepId);
      if (step && step.order.get() > 0) {
        const nextOrder = parseInt(step.order.get()) - 1;
        return steps.find((el) => el.order.get() == nextOrder);
      }
    }
  }

  public async getSuperiorsSteps(
    contextId: string,
    processId: string,
    stepOrder: number,
    equals: Boolean = false
  ) {
    return this.getStepsFromProcess(processId, contextId).then((steps) => {
      return steps
        .filter((step) => {
          const order = step.order.get();
          if (equals && order === stepOrder) return true;
          return order > stepOrder;
        })
        .map((el) => el.get());
    });
  }

  public async getInferiorsSteps(
    contextId: string,
    processId: string,
    stepOrder: number,
    equals: Boolean = false
  ) {
    return this.getStepsFromProcess(processId, contextId).then((steps) => {
      return steps
        .filter((step) => {
          const order = step.order.get();
          if (equals && order === stepOrder) return true;
          return order < stepOrder;
        })
        .map((el) => el.get());
    });
  }

  public async insertStep(
    contextId: string,
    processId: string,
    stepInfo: { name: string; color?: string; order: number }
  ) {
    return this.getSuperiorsSteps(
      contextId,
      processId,
      stepInfo.order,
      true
    ).then(async (steps) => {
      const stepId = await this.createStepNode(
        stepInfo.name,
        stepInfo.color,
        stepInfo.order,
        processId,
        contextId
      );

      for (const step of steps) {
        const realNode = SpinalGraphService.getRealNode(step.id);
        realNode.info.order.set(step.order + 1);
      }

      return stepId;
    });
  }

  //////////////////////////////////////////////////////////
  //                      TICKETS                         //
  //////////////////////////////////////////////////////////

  public async addTicket(
    ticketInfo: TicketInterface,
    processId: string,
    contextId: string,
    nodeId: string,
    ticketType: string = 'Ticket'
  ): Promise<string | Error> {
    const stepId = await this.getFirstStep(processId, contextId);

    ticketInfo.processId = processId;
    ticketInfo.stepId = stepId;
    ticketInfo.contextId = contextId;

    const ticketId = await this.createTicket(ticketInfo);

    if (ticketType == 'Alarm') {
      await SpinalGraphService.addChildInContext(
        stepId,
        ticketId,
        contextId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
      await SpinalGraphService.addChild(
        nodeId,
        ticketId,
        ALARM_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
      await this.modifyTicketStepId(ticketId, stepId);
      const userInfo = ticketInfo.user ? ticketInfo.user : {};
      await this.addLogToTicket(
        ticketId,
        LOGS_EVENTS.creation,
        userInfo,
        stepId
      );
      return ticketId;
    } else {
      await SpinalGraphService.addChildInContext(
        stepId,
        ticketId,
        contextId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
      await SpinalGraphService.addChild(
        nodeId,
        ticketId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
      await this.modifyTicketStepId(ticketId, stepId);
      const userInfo = ticketInfo.user ? ticketInfo.user : {};
      await this.addLogToTicket(
        ticketId,
        LOGS_EVENTS.creation,
        userInfo,
        stepId
      );
      return ticketId;
    }
  }

  public getTicketsFromNode(nodeId: string) {
    return SpinalGraphService.getChildren(nodeId, [
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    ]).then((children) => children.map((el) => el.get()));
  }

  public getAlarmsFromNode(nodeId: string) {
    return SpinalGraphService.getChildren(nodeId, [ALARM_RELATION_NAME]).then(
      (children) => children.map((el) => el.get())
    );
  }

  public getTicketsFromStep(stepId: string): Promise<any> {
    return SpinalGraphService.findNode(stepId).then((node) => {
      return SpinalGraphService.getChildren(node.id.get(), [
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      ]);
    });
  }

  public async moveTicket(
    ticketId: string,
    stepFromId: string,
    stepToId: string,
    contextId: string
  ): Promise<any> {
    if (
      typeof ticketId === 'undefined' ||
      typeof stepFromId === 'undefined' ||
      typeof stepToId === 'undefined'
    ) {
      return;
    }
    const step = await SpinalGraphService.getNodeAsync(stepToId);
    await SpinalGraphService.modifyNode(ticketId, <any>{
      stepId: stepToId,
    });

    return SpinalGraphService.moveChildInContext(
      stepFromId,
      stepToId,
      ticketId,
      contextId,
      <any>SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
    );
  }

  public async moveTicketToNextStep(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ): Promise<void> {

    // const ticketInfo = SpinalGraphService.getInfo(ticketId);
    const ticket = SpinalGraphService.getRealNode(ticketId);
    const ticketInfo = ticket.info;
    if (ticketInfo) {
      const stepId = ticketInfo.stepId.get();
      const nextStep = await this.getNextStep(processId, stepId, contextId);
      if (nextStep) {
        return this.moveTicket(
          ticketId,
          stepId,
          nextStep.id.get(),
          contextId
        ).then(async () => {
          await this.addLogToTicket(
            ticketId,
            LOGS_EVENTS.moveToNext,
            userInfo,
            stepId,
            nextStep.id.get()
          );
          return nextStep.get();
        });
      }
    }
  }

  public async moveTicketToPreviousStep(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ): Promise<void> {
    // const ticketInfo = SpinalGraphService.getInfo(ticketId);
    const ticket = SpinalGraphService.getRealNode(ticketId);
    const ticketInfo = ticket.info;
    if (ticketInfo) {
      const stepId = ticketInfo.stepId.get();
      const previousStep = await this.getPreviousStep(
        processId,
        stepId,
        contextId
      );
      if (previousStep) {
        return this.moveTicket(
          ticketId,
          stepId,
          previousStep.id.get(),
          contextId
        ).then(async () => {
          await this.addLogToTicket(
            ticketId,
            LOGS_EVENTS.moveToPrevious,
            userInfo,
            stepId,
            previousStep.id.get()
          );
          return previousStep.get();
        });
      }
    }
  }

  public async ArchiveTickets(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ): Promise<any> {
    const archiveId = await this.createArchivedStep(processId, contextId);
    // const ticketInfo = SpinalGraphService.getInfo(ticketId);
    const ticket = SpinalGraphService.getRealNode(ticketId);
    const ticketInfo = ticket.info;

    if (ticketInfo && archiveId) {
      const fromId = ticketInfo.stepId.get();
      await this.moveTicket(ticketId, fromId, archiveId, contextId);
      await this.addLogToTicket(
        ticketId,
        LOGS_EVENTS.archived,
        userInfo,
        fromId,
        archiveId
      );
      return SpinalGraphService.getInfo(archiveId).get();
    }
  }

  public async unarchiveTicket(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ): Promise<any> {
    // const ticketInfo = SpinalGraphService.getInfo(ticketId);
    const ticket = SpinalGraphService.getRealNode(ticketId);
    const ticketInfo = ticket.info;
    const firstStep = await this.getFirstStep(processId, contextId);

    if (ticketInfo && firstStep) {
      const fromId = ticketInfo.stepId.get();
      await this.moveTicket(ticketId, fromId, firstStep, contextId);
      await this.addLogToTicket(
        ticketId,
        LOGS_EVENTS.unarchive,
        userInfo,
        fromId,
        firstStep
      );
      return SpinalGraphService.getInfo(firstStep).get();
    }
  }

  public unlinkTicketToProcess(ticketId: string) {}

  public getTicketContextId(ticketId: string): string {
    const realNode = SpinalGraphService.getRealNode(ticketId);
    if (realNode) {
      return realNode.contextIds._attribute_names.find((id) => {
        const node = SpinalGraphService.getRealNode(id);
        if (!node) return false;
        return node.getType().get() === SERVICE_TYPE;
      });
    }
  }

  public async changeTicketProcess(
    ticketId: string,
    newProcessId: string,
    newContextId?: string
  ) {
    // let ticketInfo = SpinalGraphService.getInfo(ticketId);
    const ticket = SpinalGraphService.getRealNode(ticketId);
    const ticketInfo = ticket.info;
    let oldContextId = this.getTicketContextId(ticketId);
    const contextId = newContextId || oldContextId;

    const stepId = await this.getFirstStep(newProcessId, contextId);
    const oldStepId = await this.getOldStepId(ticketInfo.get(), oldContextId);

    if (contextId === oldContextId) {
      await SpinalGraphService.moveChildInContext(
        oldStepId,
        stepId,
        ticketId,
        contextId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
    } else {
      await this.removeFromContextId(ticketId, oldStepId, oldContextId);
      await SpinalGraphService.addChildInContext(
        stepId,
        ticketId,
        contextId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
    }

    await this.modifyTicketStepId(ticketId, stepId);
    const userInfo = ticketInfo && ticketInfo.user ? ticketInfo.user.get() : {};
    await this.addLogToTicket(ticketId, LOGS_EVENTS.creation, userInfo, stepId);

    return ticketId;
  }

  public async changeTicketElementNode(ticketId: string, newElementId: string) {
    const realNode = SpinalGraphService.getRealNode(ticketId);
    const parents = await realNode.getParents(
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME
    );

    const promises = parents.map((parent) => {
      (<any>SpinalGraphService)._addNode(parent);
      const id = parent.getId().get();
      return SpinalGraphService.removeChild(
        id,
        ticketId,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
        SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
      );
    });

    await Promise.all(promises);
    await SpinalGraphService.addChild(
      newElementId,
      ticketId,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
    );
    return ticketId;
  }

  //////////////////////////////////////////////////////////
  //                      LOGS                            //
  //////////////////////////////////////////////////////////

  public addLogToTicket(
    ticketId: string,
    event: number,
    userInfo: IUserInfo = {},
    fromId?: string,
    toId?: string
  ): any {
    let info = {
      ticketId: ticketId,
      event: event,
      action: EVENTS_TO_LOG[event],
      user: userInfo,
      steps: [],
    };

    if (fromId) info.steps.push(fromId);
    if (toId) info.steps.push(toId);

    const logId = this.createLog(info);

    return SpinalGraphService.addChild(
      ticketId,
      logId,
      SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
      SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE
    );
  }

  public createLog(info: SpinalLogTicketInterface): string {
    const logId = SpinalGraphService.createNode(
      {
        name: 'log', // info.ticketId,
        type: SERVICE_LOG_TYPE,
      },
      new SpinalLogTicket(info)
    );

    return logId;
  }

  public getLogs(ticketId: string): Promise<SpinalLogTicket[]> {
    return SpinalGraphService.getChildren(ticketId, [
      SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
    ]).then((logs) => {
      const promises = logs.map((el) => el.element.load());
      return Promise.all(promises).then((elements) => {
        return elements.map((el) => {
          const res = el.get();
          if (typeof res.action == 'undefined')
            res.action = EVENTS_TO_LOG[res.event];

          return res;
        });
      });
    });
  }

  //////////////////////////////////////////////////////////
  //                      COMMON INCIDENT                 //
  //////////////////////////////////////////////////////////

  public addCommonIncident(
    processId: string,
    sentence: string
  ): Promise<boolean | string> {
    return SpinalGraphService.getChildren(processId, [
      SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
    ]).then((children) => {
      if (children.length > 0) {
        const sectionId: string = children[0].id.get();
        const sentenceId: string = SpinalGraphService.createNode(
          {
            name: sentence,
            type: SPINAL_TICKET_SERVICE_INCIDENT_TYPE,
          },
          undefined
        );

        return SpinalGraphService.addChild(
          sectionId,
          sentenceId,
          SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
          SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE
        ).then(() => {
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

  public async getCommonIncident(processId: string): Promise<any> {
    const children = await SpinalGraphService.getChildren(processId, [
      SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
    ]);
    if (children && children.length > 0) {
      const sectionId = children[0].id.get();
      const sentences = await SpinalGraphService.getChildren(sectionId, [
        SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME,
      ]);
      return sentences.map((el) => el.get());
    }

    return [];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //                                              PRIVATE                                         //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  private modifyStepProcessId(stepId: string, processId: string): boolean {
    return SpinalGraphService.modifyNode(stepId, <any>{ processId });
  }

  private async modifyTicketStepId(ticketId, stepId): Promise<boolean> {
    const step = await SpinalGraphService.getNodeAsync(stepId);
    return SpinalGraphService.modifyNode(ticketId, <any>{ stepId });
  }

  private createTicket(
    elementInfo: TicketInterface,
    infoNode?: any
  ): Promise<string> {
    let infoNodeRef = infoNode;
    if (!infoNodeRef) {
      infoNodeRef = elementInfo;
    }

    infoNodeRef.type = SPINAL_TICKET_SERVICE_TICKET_TYPE;
    if (!infoNodeRef.declarer_id) infoNodeRef.declarer_id = 'unknow';
    const ticket = new SpinalTicket(elementInfo);
    const ticketId = SpinalGraphService.createNode(infoNodeRef, ticket);
    // this.tickets.add(ticketId);
    return this.createAttribute(ticketId, elementInfo).then(() => ticketId);
  }

  private createAttribute(
    ticketId: string,
    elementInfo: TicketInterface
  ): Promise<any> {
    const node = SpinalGraphService.getRealNode(ticketId);
    const categoryName: string = 'default';

    return serviceDocumentation
      .addCategoryAttribute(node, categoryName)
      .then((attributeCategory) => {
        const promises = [];
        if (node) {
          const attributes = Object.keys(elementInfo);

          for (const element of attributes) {
            promises.push(
              serviceDocumentation.addAttributeByCategory(
                node,
                attributeCategory,
                element,
                this.getObjData(element, node.info[element])
              )
            );
          }
          promises.push(
            serviceDocumentation.addAttributeByCategory(
              node,
              attributeCategory,
              TICKET_ATTRIBUTE_OCCURENCE_NAME,
              '0',
              'number'
            )
          );
          return Promise.all(promises);
        }
      });
  }

  private createStep(
    name: string,
    color: string,
    order: number,
    processId?: string
  ): string {
    // this.stepOrderIsValid(processId, order);

    const stepId = SpinalGraphService.createNode(
      {
        name,
        color,
        order,
        type: SPINAL_TICKET_SERVICE_STEP_TYPE,
      },
      undefined
    );

    // this.steps.add(stepId);
    return stepId;
  }

  private getContextSteps(contextId: string): Promise<any> {
    const realNode = SpinalGraphService.getRealNode(contextId);
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

  private addSentenceSection(processId: string): Promise<boolean | string> {
    return SpinalGraphService.getChildren(processId, [
      SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
    ]).then((children) => {
      if (children.length > 0) {
        return Promise.reject(DEFAULT_SENTENCE_SECTION_ALREADY_EXIST);
      }

      const sentenceId = SpinalGraphService.createNode(
        {
          processId,
          name: DEFAULT_INCIDENTS_NAME,
          type: SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE,
        },
        undefined
      );

      return SpinalGraphService.addChild(
        processId,
        sentenceId,
        SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
        SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE
      )
        .then((e) => {
          return Promise.resolve(true);
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    });
  }

  private getObjData(key, valueModel): any {
    switch (key) {
      case 'name':
        return valueModel;

      case 'priority':
        const found = Object.keys(TICKET_PRIORITIES).find(
          (el) => TICKET_PRIORITIES[el] == valueModel.get()
        );
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

  private createArchivedStep(
    processId: string,
    contextId: string
  ): Promise<any> {
    return this.getStepsFromProcess(processId, contextId).then((result) => {
      const found = result.find(
        (el) =>
          el.name.get() === ARCHIVED_STEP.name &&
          el.order.get() === ARCHIVED_STEP.order
      );
      if (found) return found.id.get();

      return this.createStepNode(
        ARCHIVED_STEP.name,
        ARCHIVED_STEP.color,
        ARCHIVED_STEP.order,
        processId,
        contextId
      );
    });
  }

  private async createStepNode(
    name: string,
    color: string,
    order: number,
    processId: string,
    contextId: string
  ): Promise<any> {
    const stepId = await this.createStep(name, color, order, processId);

    return SpinalGraphService.addChildInContext(
      processId,
      stepId,
      contextId,
      SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
      SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE
    )
      .then(async () => {
        await this.modifyStepProcessId(stepId, processId);
        return stepId;
      })
      .catch((e) => {
        return Promise.reject(Error(CANNOT_ADD_STEP_TO_PROCESS + e));
      });
  }

  private sortStepByOrder(
    steps: Array<{ name: string; order: number; color?: string }>
  ): Array<{ name: string; order: number; color?: string }> {
    const stepsSorted = [...steps].sort((a, b) => a.order - b.order);

    for (let index = 0; index < stepsSorted.length; index++) {
      stepsSorted[index].order = index;
    }

    return stepsSorted;
  }

  private async removeFromContextId(
    ticketId: string,
    oldStepId: string,
    oldContextId: string
  ): Promise<boolean> {
    return SpinalGraphService.removeChild(
      oldStepId,
      ticketId,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
    ).then((result) => {
      const realNode = SpinalGraphService.getRealNode(ticketId);
      try {
        realNode.contextIds.delete(oldContextId);
        return true;
      } catch (error) {
        return false;
      }
    });
  }

  private async getOldStepId(ticketInfo: any, contextId: string) {
    const stepId = ticketInfo.stepId;
    const step = SpinalGraphService.getRealNode(stepId);
    const stepInfo = step.info;
    if (stepInfo) return stepId;
    let id2;
    await SpinalGraphService.findInContext(contextId, contextId, (node) => {
      if (node.getId().get() === stepId) {
        (<any>SpinalGraphService)._addNode(node);
        id2 = node.getId().get();
        return true;
      }
      return false;
    });
    return id2;
  }
  async getTicketsFromArchive(
    processOrSpatialNode: string | SpinalNode,
    begin: moment.MomentInput,
    end: moment.MomentInput
  ) {
    const res: SpinalNode<any>[] = [];
    for await (const ticket of this.getTicketsFromArchiveGen(
      processOrSpatialNode,
      begin,
      end
    )) {
      res.push(ticket);
    }
    return res;
  }
  async *getTicketsFromArchiveGen(
    processOrSpatialNode: string | SpinalNode,
    begin: moment.MomentInput,
    end: moment.MomentInput
  ): AsyncGenerator<SpinalNode<any>, void, unknown> {
    processOrSpatialNode =
      typeof processOrSpatialNode === 'string'
        ? SpinalGraphService.getRealNode(processOrSpatialNode)
        : processOrSpatialNode;
    const tsBegin = moment(begin).valueOf();
    const tsEnd = moment(end).valueOf();
    const isProcess = processOrSpatialNode.info.type.get() === PROCESS_TYPE;
    const timeStampAttr = isProcess
      ? ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
      : ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
    const relationName = isProcess
      ? PROCESS_ARCHIVE_TICKET_RELATION
      : SPATIAL_ARCHIVE_TICKET_RELATION;
    const archiveTicketType = isProcess
      ? PROCESS_ARCHIVE_TICKET_TYPE
      : SPATIAL_ARCHIVE_TICKET_TYPE;

    const archiveTicketNode = await this.getArchive(
      processOrSpatialNode,
      relationName,
      archiveTicketType
    );
    const archiveParts = await this.getAchivePartsFromArchive(
      archiveTicketNode
    );
    for (const archivePart of archiveParts) {
      if (
        archivePart.info.end.get() < tsBegin ||
        archivePart.info.start.get() > tsEnd
      )
        continue;
      const tickets = await archivePart.getChildren(
        ARCHIVE_TICKET_PART_TICKET_RELATION
      );
      for (const ticket of tickets) {
        if (
          ticket.info[timeStampAttr]?.get() >= tsBegin &&
          ticket.info[timeStampAttr]?.get() <= tsEnd
        ) {
          yield ticket;
        }
      }
    }
  }
  async deleteTicketFromArchive(
    processOrSpatialNode: string | SpinalNode,
    begin: number,
    end: number
  ) {
    processOrSpatialNode =
      typeof processOrSpatialNode === 'string'
        ? SpinalGraphService.getRealNode(processOrSpatialNode)
        : processOrSpatialNode;

    if (!processOrSpatialNode)
      throw new Error(
        "deleteTicketFromArchive process or spatial node ID given don't exist in graph service."
      );
    const isProcess = processOrSpatialNode.info.type.get() === PROCESS_TYPE;
    const timeStampAttr = isProcess
      ? ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
      : ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
    const relationName = isProcess
      ? PROCESS_ARCHIVE_TICKET_RELATION
      : SPATIAL_ARCHIVE_TICKET_RELATION;
    const archiveTicketType = isProcess
      ? PROCESS_ARCHIVE_TICKET_TYPE
      : SPATIAL_ARCHIVE_TICKET_TYPE;

    const tsBegin = moment(begin).valueOf();
    const tsEnd = moment(end).valueOf();
    const archiveTicketNode = await this.getArchive(
      processOrSpatialNode,
      relationName,
      archiveTicketType
    );
    const archiveParts = await this.getAchivePartsFromArchive(
      archiveTicketNode
    );
    for (const archivePart of archiveParts) {
      if (
        archivePart.info.end.get() < tsBegin ||
        archivePart.info.start.get() > tsEnd
      )
        continue;
      const tickets = await archivePart.getChildren(
        ARCHIVE_TICKET_PART_TICKET_RELATION
      );
      const ticketsToRm = tickets.filter(
        (ticket) =>
          ticket.info[timeStampAttr]?.get() >= tsBegin &&
          ticket.info[timeStampAttr]?.get() <= tsEnd
      );
      try {
        await archivePart.removeChildren(
          ticketsToRm,
          ARCHIVE_TICKET_PART_TICKET_RELATION,
          ARCHIVE_TICKET_RELATION_TYPE
        );
      } catch (error) {}
      ticketsToRm.forEach((ticket) =>
        ticket.setIndirectModificationDate(Date.now())
      );
      await this.updateArchivePartData(
        archivePart,
        archiveTicketNode,
        timeStampAttr
      );
    }
  }
  async updateArchivePartData(
    archivePart: ISpinalNodeArchivePart,
    archiveTicketNode: SpinalNode,
    timeStampAttr: string
  ) {
    const tickets = await archivePart.getChildren(
      ARCHIVE_TICKET_PART_TICKET_RELATION
    );

    if (tickets.length === 0) {
      await archiveTicketNode.removeChild(
        archivePart,
        ARCHIVE_TICKET_PART_TICKET_RELATION,
        ARCHIVE_TICKET_RELATION_TYPE
      );
    } else {
      const start = tickets[0]?.info[timeStampAttr]?.get();
      const end = tickets[tickets.length - 1]?.info[timeStampAttr]?.get();
      archivePart.info.start.set(start);
      archivePart.info.end.set(end);
      archivePart.info.name.set(this.getArchivePartNameDate(start, end));
    }
  }
  archiveTicketFromProcess(
    ticketNode: string | SpinalNode,
    processNode: string | SpinalNode,
    date: moment.MomentInput,
    maxArchiveSize = 200
  ) {
    return this.archiveTicket(
      ticketNode,
      processNode,
      date,
      maxArchiveSize,
      PROCESS_ARCHIVE_TICKET_RELATION,
      PROCESS_ARCHIVE_TICKET_TYPE,
      [STEP_TYPE],
      ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
    );
  }

  archiveTicketFromSpatial(
    ticketNode: string | SpinalNode,
    spatialNode: string | SpinalNode,
    date: moment.MomentInput,
    maxArchiveSize = 200
  ) {
    return this.archiveTicket(
      ticketNode,
      spatialNode,
      date,
      maxArchiveSize,
      SPATIAL_ARCHIVE_TICKET_RELATION,
      SPATIAL_ARCHIVE_TICKET_TYPE,
      GEO_TYPES,
      ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL
    );
  }
  private async archiveTicket(
    ticketNode: string | SpinalNode,
    processOrSpatialNode: string | SpinalNode,
    date: moment.MomentInput,
    maxArchiveSize: number,
    archiveRelationName: string,
    archiveNodeType: string,
    parentTypes: string[],
    timestampAttr: string
  ) {
    // make sure we work with spianlNode
    ticketNode =
      typeof ticketNode === 'string'
        ? SpinalGraphService.getRealNode(ticketNode)
        : ticketNode;
    processOrSpatialNode =
      typeof processOrSpatialNode === 'string'
        ? SpinalGraphService.getRealNode(processOrSpatialNode)
        : processOrSpatialNode;
    if (!processOrSpatialNode) {
      throw new Error(
        "archiveTicket process or spatial node ID given don't exist in graph service."
      );
    }
    // getOrCreateArchive
    const archiveTicketNode = await this.getOrCreateArchive(
      processOrSpatialNode,
      archiveRelationName,
      archiveNodeType
    );

    // getOrCreateArchivePart with date
    const timestamp = moment(date).valueOf();
    const archivePartNode = await this.getArchivePartFromArchive(
      archiveTicketNode,
      ARCHIVE_TICKET_PART_RELATION,
      ARCHIVE_TICKET_PART_TYPE,
      timestamp,
      maxArchiveSize
    );

    // add ticket to the part
    await archivePartNode.addChild(
      ticketNode,
      ARCHIVE_TICKET_PART_TICKET_RELATION,
      ARCHIVE_TICKET_RELATION_TYPE
    );
    // update part info
    const start = archivePartNode.info.start.get();
    archivePartNode.info.start?.set(start);
    archivePartNode.info.end?.set(timestamp);
    archivePartNode.info.name.set(
      this.getArchivePartNameDate(start, timestamp)
    );
    // add archiveTimestamp to ticket node
    if (!ticketNode.info[timestampAttr])
      ticketNode.info.add_attr(timestampAttr, timestamp);
    else ticketNode.info[timestampAttr].set(timestamp);
    ticketNode.setIndirectModificationDate(Date.now());

    // remove parent step
    await this.removeTicketFromParent(
      ticketNode,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      parentTypes
    );
  }

  private async removeTicketFromParent(
    ticketNode: SpinalNode,
    relationName: string,
    parentTypes: string[]
  ) {
    const parents = await ticketNode.getParents(relationName);
    const parentsFiltered = parents.filter((parent) =>
      parentTypes.includes(parent.info.type.get())
    );
    const proms = parentsFiltered.map((parent) => {
      return parent
        .removeChild(
          ticketNode,
          relationName,
          SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
        )
        .catch(() =>
          console.log(
            `catch erreor remove child for ${ticketNode.info.name.get()}`
          )
        );
    });
    await Promise.all(proms);
  }

  private getAchivePartsFromArchive(archive: SpinalNode) {
    return <Promise<ISpinalNodeArchivePart[]>>(
      archive.getChildren(ARCHIVE_TICKET_RELATIONS)
    );
  }
  private async getArchivePartFromArchive(
    archive: SpinalNode,
    parentRelationName: string,
    childNodeType: string,
    date: moment.MomentInput,
    maxArchiveSize: number
  ): Promise<ISpinalNodeArchivePart> {
    const children = await archive.getChildren(parentRelationName);
    const child = <ISpinalNodeArchivePart>children[children.length - 1];
    if (
      child &&
      child.info.type.get() === childNodeType &&
      maxArchiveSize > child.getNbChildren()
    ) {
      return child;
    }
    const name = this.getArchivePartNameDate(date, date);
    const archivePart = new SpinalNode(name, childNodeType);
    const timestamp = moment(date).valueOf();
    archivePart.info.add_attr({
      start: timestamp,
      end: timestamp,
    });
    await archive.addChild(
      archivePart,
      parentRelationName,
      ARCHIVE_TICKET_RELATION_TYPE
    );
    return <ISpinalNodeArchivePart>archivePart;
  }
  private async getArchive(
    node: SpinalNode,
    parentRelationNames: string,
    childNodeType: string
  ) {
    const children = await node.getChildren(parentRelationNames);
    for (const child of children) {
      if (child.info.type.get() === childNodeType) {
        return child;
      }
    }
  }
  private async getOrCreateArchive(
    node: SpinalNode,
    parentRelationName: string,
    childNodeType: string
  ) {
    const children = await node.getChildren(parentRelationName);
    for (const child of children) {
      if (child.info.type.get() === childNodeType) {
        return child;
      }
    }
    const archive = new SpinalNode(childNodeType, childNodeType);
    await node.addChild(
      archive,
      parentRelationName,
      ARCHIVE_TICKET_RELATION_TYPE
    );
    return archive;
  }

  private getArchivePartNameDate(
    start: moment.MomentInput,
    end: moment.MomentInput
  ) {
    const s = moment(start).format();
    const e = moment(end).format();
    return `${s} - ${e}`;
  }
}
