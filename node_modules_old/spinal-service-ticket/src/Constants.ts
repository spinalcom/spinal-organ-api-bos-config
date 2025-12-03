/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */
import * as OLD_CONSTANTS from './old_constants';
export * from './old_constants';
import { SPINAL_RELATION_PTR_LST_TYPE } from 'spinal-model-graph';
export { GEOGRAPHIC_TYPES_ORDER as GEO_TYPES } from 'spinal-env-viewer-context-geographic-service';
import { GEOGRAPHIC_TYPES_ORDER as GEO_TYPES } from 'spinal-env-viewer-context-geographic-service';

export const TICKET_CONTEXT_TYPE: string = OLD_CONSTANTS.SERVICE_TYPE;
export const TICKET_CONTEXT_SUBTYPE_LIST: Array<string> = ['Ticket', 'Alarm'];
/////////////////////////////////////////
/////////////// TICKET ///////////////////
export const TICKET_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE; // STEP_TO_TICKET_RELATION_TYPE
export const TICKET_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME; // STEP_TO_TICKET_RELATION_NAME
export const TIKET_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_TYPE;
export const TICKET_ATTRIBUTE_OCCURENCE_NAME = 'Occurrence number';
export const ALARM_RELATION_NAME = 'hasAlarm';
/////////////////////////////////////////
/////////////// PROCESS /////////////////
export const PROCESS_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE; // CONTEXT_TO_PROCESS_RELATION_TYPE
export const PROCESS_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME; //CONTEXT_TO_PROCESS_RELATION_NAME
export const _PROCESS_TYPE: string = OLD_CONSTANTS.PROCESS_TYPE;
//////////////////////////////////////
/////////////// STEP /////////////////
export const STEP_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE; // PROCESS_TO_STEP_RELATION_TYPE
export const STEP_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME; // PROCESS_TO_STEP_RELATION_NAME
export const STEP_TYPE: string = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_TYPE;

export const ARCHIVED_STEP = OLD_CONSTANTS.ARCHIVED_STEP;
export const DEFAULT_STEPS = OLD_CONSTANTS.DEFAULT_STEPS;
export const _ARCHIVED_STEP = OLD_CONSTANTS.ARCHIVED_STEP;
export const _DEFAULT_STEPS = OLD_CONSTANTS.DEFAULT_STEPS;

/////////////////////////////////////////
/////////////// CATEGORY ////////////////
export const INCIDENT_SECTION_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE;
export const INCIDENT_SECTION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE;
export const INCIDENT_SECTION_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME;
export const INCIDENT_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE;
export const INCIDENT_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME;
export const INCIDENT_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_TYPE;
export const _DEFAULT_INCIDENTS_NAME: string =
  OLD_CONSTANTS.DEFAULT_INCIDENTS_NAME;
export const LOG_RELATION_TYPE: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE;
export const LOG_RELATION_NAME: string =
  OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME;
export const LOG_TYPE: string = OLD_CONSTANTS.SERVICE_LOG_TYPE;
export const LOGS_EVENTS_STEPS = OLD_CONSTANTS.LOGS_EVENTS;
export const _TICKET_PRIORITIES = OLD_CONSTANTS.TICKET_PRIORITIES;

/////////////////////////////////////////
/////////////// ARCHIVE ////////////////
export const PROCESS_ARCHIVE_TICKET_RELATION = 'ProcessHasArchiveTicket';
export const PROCESS_ARCHIVE_TICKET_TYPE = 'ProcessArchiveTicket';
export const SPATIAL_ARCHIVE_TICKET_RELATION = 'SpatialHasArchiveTicket';
export const SPATIAL_ARCHIVE_TICKET_TYPE = 'SpatialArchiveTicket';
export const ARCHIVE_TICKET_PART_RELATION = 'ArchiveTicketHasPart';
export const ARCHIVE_TICKET_PART_TYPE = 'ArchiveTicketPart';
export const ARCHIVE_TICKET_PART_TICKET_RELATION = 'ArchiveTicketPartHasTicket';
export const ARCHIVE_TICKET_RELATION_TYPE = SPINAL_RELATION_PTR_LST_TYPE;
export const ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS = 'ProcessArchiveTimestamp';
export const ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL = 'SpatialArchiveTimestamp';
export const ARCHIVE_TICKET_RELATIONS = [
  SPATIAL_ARCHIVE_TICKET_RELATION,
  ARCHIVE_TICKET_PART_RELATION,
];
