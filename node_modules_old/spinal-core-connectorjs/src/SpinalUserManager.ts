/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import { sendXhr } from './Utils/sendXhr';

export class SpinalUserManager {
  public static async get_user_id(
    options: string | URL,
    username: string,
    password: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ): Promise<string> {
    // Access: /get_user_id?u=<user>&p=<password>
    const get_cmd = `/get_user_id?u=${username}&p=${password}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(error_callback, 'get_user_id', error);
    }
  }

  public static async get_admin_id(
    options: string | URL,
    adminName: string,
    password: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ): Promise<string> {
    // Access: /get_user_id?u=<user>&p=<password>
    var get_cmd = `/get_admin_id?u=${adminName}&p=${password}`;

    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(error_callback, 'get_admin_id', error);
    }
  }

  public static async new_account(
    options: string | URL,
    username: string,
    password: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ): Promise<string> {
    // Access: /get_new_account?e=<user>&p=<password>&cp=<confirm_password>
    var get_cmd = `/get_new_account?e=${username}&p=${password}&cp=${password}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(error_callback, 'get_new_account', error);
    }
  }

  public static async change_password(
    options: string | URL,
    user_id: string | number,
    password: string,
    newPassword: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ): Promise<string> {
    // Access: /get_change_user_password?e=<user>&op=<old_pass>&np=<newpass>&cp=<confim_pass>
    var get_cmd = `/get_change_user_password?e=${user_id}&op=${password}&np=${newPassword}&cp=${newPassword}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(
        error_callback,
        'get_change_user_password',
        error
      );
    }
  }

  public static async delete_account(
    options: string | URL,
    userId: string | number,
    password: string,
    userNameToDelete: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ) {
    // Access: /get_delete_account?e=<user>&i=<id>&p=<password>
    const get_cmd = `/get_delete_account?e=${userNameToDelete}&i=${userId}&p=${password}`;

    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(error_callback, 'get_delete_account', error);
    }
  }

  public static async change_password_by_admin(
    options: string | URL,
    targetUsername: string,
    targetPassword: string,
    adminUserId: string | number,
    adminPassword: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ) {
    // Access: ?u=<username>&np=<newpass>&a=<admin_id>&ap=<adminPass>
    // admin == 644(root) or 168(admin)
    const get_cmd = `/get_change_user_password_by_admin?u=${targetUsername}&np=${targetPassword}&a=${adminUserId}&ap=${adminPassword}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(
        error_callback,
        'get_change_user_password_by_admin',
        error
      );
    }
  }

  public static async delete_account_by_admin(
    options: string | URL,
    targetUsername: string,
    adminUserId: string | number,
    adminPassword: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ) {
    // Access: /get_delete_account_by_admin?u=<username>&a=<admin_id>&ap=<adminPassword>
    // admin == 644(root) or 168(admin)
    const get_cmd = `/get_delete_account_by_admin?u=${targetUsername}&a=${adminUserId}&ap=${adminPassword}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(
        error_callback,
        'get_delete_account_by_admin',
        error
      );
    }
  }

  public static async change_account_rights_by_admin(
    options: string | URL,
    targetUsername: string,
    targetAcountRight: string | number,
    adminUserId: string | number,
    adminPassword: string,
    success_callback?: (response: string) => void,
    error_callback: () => void = null
  ) {
    // Access: ?u=<username>&ri=<rights>&a=<admin_id>&ap=<adminPass>
    // admin == 644(root) or 168(admin)
    const get_cmd = `/get_change_account_rights_by_admin?u=${targetUsername}&ri=${targetAcountRight}&a=${adminUserId}&ap=${adminPassword}`;
    try {
      const response = await sendXhr(options, get_cmd, 'GET');
      if (parseInt(response) === -1)
        throw new Error('command rejected by the server');
      if (typeof success_callback === 'function') {
        success_callback(response);
      }
      return response;
    } catch (error) {
      SpinalUserManager._if_error(
        error_callback,
        'get_change_account_rights_by_admin',
        error
      );
    }
  }

  public static _if_error(
    error_callback: (e: Error) => void,
    fun: string,
    response: Error
  ): void {
    if (error_callback !== null) {
      return error_callback(response);
    } else {
      return console.log(
        'Error on ' + fun + ' and the error_callback was not set.'
      );
    }
  }
}
