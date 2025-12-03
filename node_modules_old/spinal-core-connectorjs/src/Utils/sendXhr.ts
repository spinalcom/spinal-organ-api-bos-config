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

import { FileSystem } from '../FileSystem/FileSystem';

export type HTTP_METHOD = 'GET' | 'POST';

export function sendXhr(
  options: string | URL,
  command: string,
  httpMethod: 'POST',
  header?: { [key: string]: string },
  body?: { [key: string]: string } | string
): Promise<string>;
export function sendXhr(
  options: string | URL,
  command: string,
  httpMethod: 'GET',
  header?: { [key: string]: string }
): Promise<string>;
export function sendXhr(
  options: string | URL,
  command: string,
  httpMethod: HTTP_METHOD,
  header?: { [key: string]: string },
  body?: { [key: string]: string } | string
): Promise<string> {
  let path: string = '';
  const parsedOpt = typeof options === 'string' ? new URL(options) : options;
  const url = parsedOpt.hostname;
  const port = parsedOpt.port;
  if (FileSystem.CONNECTOR_TYPE === 'Node' || FileSystem.is_cordova) {
    path = `${parsedOpt.protocol}//${url}${port}` ? ':' + port : '' + command;
  } else if (FileSystem.CONNECTOR_TYPE === 'Browser') {
    path = command;
  }
  return new Promise((resolve, reject): void => {
    const xhr_object = FileSystem._my_xml_http_request();
    xhr_object.open(httpMethod, path, true);
    xhr_object.onreadystatechange = function (): void {
      if (this.readyState === 4 && this.status === 200) {
        return resolve(this.responseText);
      } else if (this.readyState === 4) {
        return reject(this.status);
      }
    };
    if (header) {
      for (const key in header) {
        if (Object.prototype.hasOwnProperty.call(header, key)) {
          xhr_object.setRequestHeader(key, header[key]);
        }
      }
    }
    xhr_object.send(body);
  });
}
