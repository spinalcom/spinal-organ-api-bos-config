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
const ERROR_PREFIX : string = 'Spinal Service User Error: ';
export const PROCESS_NAME_ALREADY_USED : string = `${ERROR_PREFIX}Process name already used`;
export const CANNOT_CREATE_CONTEXT_INTERNAL_ERROR : string =
  `${ERROR_PREFIX}Internal error: cannot create context`;

export const USER_NOT_FOUND : string = `${ERROR_PREFIX}USER NOT FOUND`;
export const USER_BASE_EMPTY: string = `${ERROR_PREFIX}NO USER REGISTER`;
export const USER_ALREADY_EXIST: string = `${ERROR_PREFIX}NO USER REGISTER`;
