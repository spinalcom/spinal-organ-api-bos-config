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

const ERROR_PREFIX: string = 'Spinal Service Ticket Error: ';
export const PROCESS_NAME_ALREADY_USED: string =
  ERROR_PREFIX + 'Process name already used';
export const CANNOT_CREATE_PROCESS_INTERNAL_ERROR: string =
  ERROR_PREFIX + 'Internal error: cannot create process';
export const CANNOT_CREATE_CONTEXT_INTERNAL_ERROR: string =
  ERROR_PREFIX + 'Internal error: cannot create context';
export const CANNOT_ADD_STEP_TO_PROCESS: string =
  ERROR_PREFIX + 'Internal error: cannot create context';
export const PROCESS_ID_DOES_NOT_EXIST: string =
  ERROR_PREFIX + "Process id doesn't exist";
export const STEP_ID_DOES_NOT_EXIST: string =
  ERROR_PREFIX + "Step id doesn't exist";
export const TICKET_ID_DOES_NOT_EXIST: string =
  ERROR_PREFIX + "Ticket id doesn't exist";
export const DEFAULT_SENTENCE_SECTION_ALREADY_EXIST: string =
  ERROR_PREFIX + 'Default sentence section already exits';
export const TICKET_SECTION_ALREADY_EXIST: string =
  ERROR_PREFIX + 'Ticket' + ' already exits';
export const STEP_ORDER_NOT_VALID: string =
  ERROR_PREFIX + ' step order not valid';
