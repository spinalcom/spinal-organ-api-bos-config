/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

// interface ISpinalEvent {
//     [key: string]: Array<Function>
// }

import { EventEmitter } from "events";


export class SpinalEventEmitter extends EventEmitter {
    // private _events: ISpinalEvent = {};

    constructor() {
        super();
    }

    // public on(eventName: string, listener: Function) {
    //     console.log("listener", eventName)
    //     if (!this._events[eventName]) {
    //         this._events[eventName] = []
    //     }

    //     this._events[eventName].push(listener);
    // }

    // public emit(eventName: string, data: any) {
    //     console.log("eventName", eventName)
    //     if (!this._events[eventName]) {
    //         return;
    //     }

    //     this._events[eventName].forEach((callback) => {
    //         if (typeof callback === "function") callback(data);
    //     })

    // }

}