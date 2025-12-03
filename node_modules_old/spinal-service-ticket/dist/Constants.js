"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCHIVE_TICKET_RELATIONS = exports.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL = exports.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS = exports.ARCHIVE_TICKET_RELATION_TYPE = exports.ARCHIVE_TICKET_PART_TICKET_RELATION = exports.ARCHIVE_TICKET_PART_TYPE = exports.ARCHIVE_TICKET_PART_RELATION = exports.SPATIAL_ARCHIVE_TICKET_TYPE = exports.SPATIAL_ARCHIVE_TICKET_RELATION = exports.PROCESS_ARCHIVE_TICKET_TYPE = exports.PROCESS_ARCHIVE_TICKET_RELATION = exports._TICKET_PRIORITIES = exports.LOGS_EVENTS_STEPS = exports.LOG_TYPE = exports.LOG_RELATION_NAME = exports.LOG_RELATION_TYPE = exports._DEFAULT_INCIDENTS_NAME = exports.INCIDENT_TYPE = exports.INCIDENT_RELATION_NAME = exports.INCIDENT_RELATION_TYPE = exports.INCIDENT_SECTION_RELATION_NAME = exports.INCIDENT_SECTION_TYPE = exports.INCIDENT_SECTION_RELATION_TYPE = exports._DEFAULT_STEPS = exports._ARCHIVED_STEP = exports.DEFAULT_STEPS = exports.ARCHIVED_STEP = exports.STEP_TYPE = exports.STEP_RELATION_NAME = exports.STEP_RELATION_TYPE = exports._PROCESS_TYPE = exports.PROCESS_RELATION_NAME = exports.PROCESS_RELATION_TYPE = exports.ALARM_RELATION_NAME = exports.TICKET_ATTRIBUTE_OCCURENCE_NAME = exports.TIKET_TYPE = exports.TICKET_RELATION_NAME = exports.TICKET_RELATION_TYPE = exports.TICKET_CONTEXT_SUBTYPE_LIST = exports.TICKET_CONTEXT_TYPE = exports.GEO_TYPES = void 0;
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
const OLD_CONSTANTS = require("./old_constants");
__exportStar(require("./old_constants"), exports);
const spinal_model_graph_1 = require("spinal-model-graph");
var spinal_env_viewer_context_geographic_service_1 = require("spinal-env-viewer-context-geographic-service");
Object.defineProperty(exports, "GEO_TYPES", { enumerable: true, get: function () { return spinal_env_viewer_context_geographic_service_1.GEOGRAPHIC_TYPES_ORDER; } });
exports.TICKET_CONTEXT_TYPE = OLD_CONSTANTS.SERVICE_TYPE;
exports.TICKET_CONTEXT_SUBTYPE_LIST = ['Ticket', 'Alarm'];
/////////////////////////////////////////
/////////////// TICKET ///////////////////
exports.TICKET_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE; // STEP_TO_TICKET_RELATION_TYPE
exports.TICKET_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME; // STEP_TO_TICKET_RELATION_NAME
exports.TIKET_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_TICKET_TYPE;
exports.TICKET_ATTRIBUTE_OCCURENCE_NAME = 'Occurrence number';
exports.ALARM_RELATION_NAME = 'hasAlarm';
/////////////////////////////////////////
/////////////// PROCESS /////////////////
exports.PROCESS_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE; // CONTEXT_TO_PROCESS_RELATION_TYPE
exports.PROCESS_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME; //CONTEXT_TO_PROCESS_RELATION_NAME
exports._PROCESS_TYPE = OLD_CONSTANTS.PROCESS_TYPE;
//////////////////////////////////////
/////////////// STEP /////////////////
exports.STEP_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE; // PROCESS_TO_STEP_RELATION_TYPE
exports.STEP_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME; // PROCESS_TO_STEP_RELATION_NAME
exports.STEP_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_STEP_TYPE;
exports.ARCHIVED_STEP = OLD_CONSTANTS.ARCHIVED_STEP;
exports.DEFAULT_STEPS = OLD_CONSTANTS.DEFAULT_STEPS;
exports._ARCHIVED_STEP = OLD_CONSTANTS.ARCHIVED_STEP;
exports._DEFAULT_STEPS = OLD_CONSTANTS.DEFAULT_STEPS;
/////////////////////////////////////////
/////////////// CATEGORY ////////////////
exports.INCIDENT_SECTION_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE;
exports.INCIDENT_SECTION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE;
exports.INCIDENT_SECTION_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME;
exports.INCIDENT_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE;
exports.INCIDENT_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME;
exports.INCIDENT_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_INCIDENT_TYPE;
exports._DEFAULT_INCIDENTS_NAME = OLD_CONSTANTS.DEFAULT_INCIDENTS_NAME;
exports.LOG_RELATION_TYPE = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE;
exports.LOG_RELATION_NAME = OLD_CONSTANTS.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME;
exports.LOG_TYPE = OLD_CONSTANTS.SERVICE_LOG_TYPE;
exports.LOGS_EVENTS_STEPS = OLD_CONSTANTS.LOGS_EVENTS;
exports._TICKET_PRIORITIES = OLD_CONSTANTS.TICKET_PRIORITIES;
/////////////////////////////////////////
/////////////// ARCHIVE ////////////////
exports.PROCESS_ARCHIVE_TICKET_RELATION = 'ProcessHasArchiveTicket';
exports.PROCESS_ARCHIVE_TICKET_TYPE = 'ProcessArchiveTicket';
exports.SPATIAL_ARCHIVE_TICKET_RELATION = 'SpatialHasArchiveTicket';
exports.SPATIAL_ARCHIVE_TICKET_TYPE = 'SpatialArchiveTicket';
exports.ARCHIVE_TICKET_PART_RELATION = 'ArchiveTicketHasPart';
exports.ARCHIVE_TICKET_PART_TYPE = 'ArchiveTicketPart';
exports.ARCHIVE_TICKET_PART_TICKET_RELATION = 'ArchiveTicketPartHasTicket';
exports.ARCHIVE_TICKET_RELATION_TYPE = spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE;
exports.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS = 'ProcessArchiveTimestamp';
exports.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL = 'SpatialArchiveTimestamp';
exports.ARCHIVE_TICKET_RELATIONS = [
    exports.SPATIAL_ARCHIVE_TICKET_RELATION,
    exports.ARCHIVE_TICKET_PART_RELATION,
];
//# sourceMappingURL=Constants.js.map