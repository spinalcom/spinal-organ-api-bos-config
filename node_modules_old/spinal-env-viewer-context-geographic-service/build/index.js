"use strict";
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
const constants = require("./constants");
const geoServiceV2_1 = require("./geoServiceV2");
const graphservice_1 = require("./graphservice");
__exportStar(require("./constants"), exports);
__exportStar(require("./geoServiceV2"), exports);
/**
 * This method takes as parameters a context (SpinalContext), a parent node (must be a SpinalNode) and a string representing the abstract element type;
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentNodeRef - The parent Node
 * @param {string} elementName - The AbstactElement Name
 * @returns {Promise<SpinalNode>}
 */
function addAbstractElement(contextRef, parentNodeRef, elementName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextRef.id.get());
        const parent = (0, graphservice_1.getRealNode)(parentNodeRef.id.get());
        const node = yield (0, geoServiceV2_1.addAbstractElement)(context, parent, elementName);
        (0, graphservice_1.addNodeGraphService)(node);
        return (0, graphservice_1.getInfoGraphService)(node.info.id.get());
    });
}
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} buildingName - Building Name
 */
function addBuilding(contextId, parentId, buildingName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextId);
        const parent = (0, graphservice_1.getRealNode)(parentId);
        const node = yield (0, geoServiceV2_1.addBuilding)(context, parent, buildingName);
        (0, graphservice_1.addNodeGraphService)(node);
        return node;
    });
}
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} floorName - the floor Name
 */
function addFloor(contextId, parentId, floorName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextId);
        const parent = (0, graphservice_1.getRealNode)(parentId);
        const node = yield (0, geoServiceV2_1.addFloor)(context, parent, floorName);
        (0, graphservice_1.addNodeGraphService)(node);
        return node;
    });
}
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} siteName - the site Name
 */
function addSite(contextId, parentId, siteName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextId);
        const parent = (0, graphservice_1.getRealNode)(parentId);
        const node = yield (0, geoServiceV2_1.addSite)(context, parent, siteName);
        (0, graphservice_1.addNodeGraphService)(node);
        return node;
    });
}
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} zoneName - Zone name
 */
function addZone(contextId, parentId, zoneName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextId);
        const parent = (0, graphservice_1.getRealNode)(parentId);
        const node = yield (0, geoServiceV2_1.addZone)(context, parent, zoneName);
        (0, graphservice_1.addNodeGraphService)(node);
        return node;
    });
}
/**
 * @param {string} contextId - The Context geographic
 * @param {string} parentId - The parent Node
 * @param {string} roomName - Room Name
 */
function addRoom(contextId, parentId, roomName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, graphservice_1.getRealNode)(contextId);
        const parent = (0, graphservice_1.getRealNode)(parentId);
        const node = yield (0, geoServiceV2_1.addRoom)(context, parent, roomName);
        (0, graphservice_1.addNodeGraphService)(node);
        return node;
    });
}
/**
 * it uses bimObject service to add all dbIds passed as parameters.
 * the parameter elements can be a simple or an array of the following element interface.
 * `{ dbId: number, name: string }`
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentRef - The parent Node
 * @param {TAddBimElementItem | TAddBimElementItem[]} elements
 */
function addBimElement(contextRef, parentRef, elements, model) {
    let context = (0, graphservice_1.getRealNode)(contextRef.id.get());
    let parent = (0, graphservice_1.getRealNode)(parentRef.id.get());
    return (0, geoServiceV2_1.addBimElement)(context, parent, elements, model);
}
function _getReferenceContextName(nodeId) {
    let node = (0, graphservice_1.getRealNode)(nodeId);
    return (0, geoServiceV2_1._getReferenceContextName)(node.info.type.get());
}
/**
 *
 * @param {string} nodeId
 */
function addToReferenceContext(nodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let node = (0, graphservice_1.getRealNode)(nodeId);
        return (0, geoServiceV2_1.addToReferenceContext)(node);
    });
}
/**
 *
 * @param {string} contextId
 */
function addContextToReference(contextId) {
    let context = (0, graphservice_1.getRealNode)(contextId);
    return (0, geoServiceV2_1.addContextToReference)(context);
}
const GeographicContext = {
    constants,
    getChildType: geoServiceV2_1.getChildType,
    createContext: geoServiceV2_1.createContext,
    addAbstractElement,
    addBuilding,
    addFloor,
    addSite,
    addZone,
    addRoom,
    addBimElement,
    _getReferenceContextName,
    addToReferenceContext,
    addContextToReference,
};
exports.default = GeographicContext;
//# sourceMappingURL=index.js.map