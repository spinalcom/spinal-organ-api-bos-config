"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.STEP_ORDER_NOT_VALID = exports.TICKET_SECTION_ALREADY_EXIST = exports.DEFAULT_SENTENCE_SECTION_ALREADY_EXIST = exports.TICKET_ID_DOES_NOT_EXIST = exports.STEP_ID_DOES_NOT_EXIST = exports.PROCESS_ID_DOES_NOT_EXIST = exports.CANNOT_ADD_STEP_TO_PROCESS = exports.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR = exports.CANNOT_CREATE_PROCESS_INTERNAL_ERROR = exports.PROCESS_NAME_ALREADY_USED = void 0;
const ERROR_PREFIX = 'Spinal Service Ticket Error: ';
exports.PROCESS_NAME_ALREADY_USED = ERROR_PREFIX + 'Process name already used';
exports.CANNOT_CREATE_PROCESS_INTERNAL_ERROR = ERROR_PREFIX + 'Internal error: cannot create process';
exports.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR = ERROR_PREFIX + 'Internal error: cannot create context';
exports.CANNOT_ADD_STEP_TO_PROCESS = ERROR_PREFIX + 'Internal error: cannot create context';
exports.PROCESS_ID_DOES_NOT_EXIST = ERROR_PREFIX + "Process id doesn't exist";
exports.STEP_ID_DOES_NOT_EXIST = ERROR_PREFIX + "Step id doesn't exist";
exports.TICKET_ID_DOES_NOT_EXIST = ERROR_PREFIX + "Ticket id doesn't exist";
exports.DEFAULT_SENTENCE_SECTION_ALREADY_EXIST = ERROR_PREFIX + 'Default sentence section already exits';
exports.TICKET_SECTION_ALREADY_EXIST = ERROR_PREFIX + 'Ticket' + ' already exits';
exports.STEP_ORDER_NOT_VALID = ERROR_PREFIX + ' step order not valid';
//# sourceMappingURL=Errors.js.map