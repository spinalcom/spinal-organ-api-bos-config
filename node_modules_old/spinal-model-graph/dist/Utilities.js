"use strict";
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeBatch = exports.loadParentRelation = exports.guid = void 0;
/**
 * Generates a random number and returns in a string.
 * @returns {String} Random number in a string
 */
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
/**
 * Creates a unique id based on a name.
 * @param {string} name Name from wich the id is generated
 * @returns {string} Generated id
 */
function guid() {
    return `${s4()}-${s4()}-${s4()}-${Date.now().toString(16)}`;
}
exports.guid = guid;
function loadParentRelation(spinalNodePointer, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const relation = yield spinalNodePointer.load();
            if (relation && context && relation.belongsToContext(context) === false) {
                return undefined;
            }
            try {
                const parent = yield relation.getParent();
                if (context && parent.belongsToContext(context) === false)
                    return undefined;
                return parent;
            }
            catch (e) {
                relation.removeFromGraph();
                return undefined;
            }
        }
        catch (e) {
            return undefined;
        }
    });
}
exports.loadParentRelation = loadParentRelation;
function consumeBatch(promises, batchSize = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        const result = [];
        while (index < promises.length) {
            let endIndex = index + batchSize;
            if (promises.length <= endIndex)
                endIndex = promises.length;
            const slice = promises.slice(index, endIndex);
            const resProm = yield Promise.all(slice.map((e) => e()));
            result.push(...resProm);
            index = endIndex;
        }
        return result;
    });
}
exports.consumeBatch = consumeBatch;
// export function sendEventFunc(eventName: string, parentNode: SpinalNode<any>, childNode: SpinalNode<any>, contextNode: SpinalContext<any>) {
//   spinalEventEmitter.emit(eventName,);
// }
//# sourceMappingURL=Utilities.js.map