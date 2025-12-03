"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContextToReference = exports.getOrCreateRefContext = exports.getOrCreateElemFromReferenceContext = exports.addToReferenceContext = exports._getReferenceContextName = exports.addBimElement = exports.addRoom = exports.addZone = exports.addSite = exports.addFloor = exports.addBuilding = exports.addAbstractElement = exports.createContext = exports.getChildType = void 0;
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
const spinal_model_graph_1 = require("spinal-model-graph");
const constants_1 = require("./constants");
const graphservice_1 = require("./graphservice");
const dicoContextRef = new Map();
/**
 * Returns the child type of the type given as parameter.
 * @param {string} parentType
 * @return {string} Child type
 */
function getChildType(parentType) {
    let parentTypeIndex = constants_1.GEOGRAPHIC_TYPES_ORDER.indexOf(parentType);
    if (parentTypeIndex === -1) {
        return '';
    }
    return constants_1.GEOGRAPHIC_TYPES_ORDER[parentTypeIndex + 1];
}
exports.getChildType = getChildType;
function createContext(contextName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof contextName !== 'string') {
            throw Error('contextName must be a string');
        }
        const graph = (0, graphservice_1.getGraph)();
        const context = yield graph.getContext(contextName);
        if (typeof context !== 'undefined')
            return Promise.resolve(context);
        const contextRes = new spinal_model_graph_1.SpinalContext(contextName, constants_1.CONTEXT_TYPE);
        yield graph.addContext(contextRes);
        (0, graphservice_1.addNodeGraphService)(contextRes);
        return contextRes;
    });
}
exports.createContext = createContext;
function addAbstractElement(context, parent, elementName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const parentType = parent.info.type.get();
        const childType = getChildType(parentType);
        if (!childType) {
            throw Error(`${parentType} is not a valid type in geographic context`);
        }
        return getOrCreateElemFromReferenceContext(childType, context, parent, elementName, id);
    });
}
exports.addAbstractElement = addAbstractElement;
function addBuilding(context, parent, elementName, id) {
    return getOrCreateElemFromReferenceContext(constants_1.BUILDING_TYPE, context, parent, elementName, id);
}
exports.addBuilding = addBuilding;
function addFloor(context, parent, elementName, id) {
    return getOrCreateElemFromReferenceContext(constants_1.FLOOR_TYPE, context, parent, elementName, id);
}
exports.addFloor = addFloor;
function addSite(context, parent, elementName, id) {
    return getOrCreateElemFromReferenceContext(constants_1.SITE_TYPE, context, parent, elementName, id);
}
exports.addSite = addSite;
function addZone(context, parent, elementName, id) {
    return getOrCreateElemFromReferenceContext(constants_1.ZONE_TYPE, context, parent, elementName, id);
}
exports.addZone = addZone;
function addRoom(context, parent, elementName, id) {
    return getOrCreateElemFromReferenceContext(constants_1.ROOM_TYPE, context, parent, elementName, id);
}
exports.addRoom = addRoom;
function addBimElement(context, parent, elements, model) {
    const elems = Array.isArray(elements) ? elements : [elements];
    let contextId = context.info.id.get();
    let parentId = parent.info.id.get();
    (0, graphservice_1.addNodeGraphService)(context);
    (0, graphservice_1.addNodeGraphService)(parent);
    return Promise.all(elems.map((element) => {
        return window.spinal.BimObjectService.addBIMObject(contextId, parentId, element.dbId, element.name, model);
    }));
}
exports.addBimElement = addBimElement;
function _getReferenceContextName(nodeType) {
    switch (nodeType) {
        case constants_1.SITE_TYPE:
            return {
                name: constants_1.SITE_REFERENCE_CONTEXT,
                relation: constants_1.SITE_RELATION,
            };
        case constants_1.BUILDING_TYPE:
            return {
                name: constants_1.BUILDING_REFERENCE_CONTEXT,
                relation: constants_1.BUILDING_RELATION,
            };
        case constants_1.FLOOR_TYPE:
            return {
                name: constants_1.FLOOR_REFERENCE_CONTEXT,
                relation: constants_1.FLOOR_RELATION,
            };
        case constants_1.ZONE_TYPE:
            return {
                name: constants_1.ZONE_REFERENCE_CONTEXT,
                relation: constants_1.ZONE_RELATION,
            };
        case constants_1.ROOM_TYPE:
            return {
                name: constants_1.ROOM_REFERENCE_CONTEXT,
                relation: constants_1.ROOM_RELATION,
            };
        default:
            return undefined;
    }
}
exports._getReferenceContextName = _getReferenceContextName;
function addToReferenceContext(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = _getReferenceContextName(node.info.type.get());
        if (typeof obj !== 'undefined') {
            let context = yield getOrCreateRefContext(obj.name);
            yield context.addChild(node, obj.relation, spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE);
        }
    });
}
exports.addToReferenceContext = addToReferenceContext;
function getOrCreateElemFromReferenceContext(nodeType, context, parent, elementName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = _getReferenceContextName(nodeType);
        if (typeof obj === 'undefined')
            throw new Error(`error unknonw node type : ${nodeType}`);
        const refContext = yield getOrCreateRefContext(obj.name);
        let node;
        if (typeof id !== 'undefined') {
            const refNodes = yield refContext.getChildren(obj.relation);
            node = refNodes.find((itm) => itm.info.id.get() === id);
        }
        if (!node) {
            node = new spinal_model_graph_1.SpinalNode(elementName, nodeType);
            if (typeof id !== 'undefined')
                node.info.id.set(id);
            yield refContext.addChild(node, obj.relation, spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE);
        }
        yield parent.addChildInContext(node, obj.relation, spinal_model_graph_1.SPINAL_RELATION_PTR_LST_TYPE, context);
        return node;
    });
}
exports.getOrCreateElemFromReferenceContext = getOrCreateElemFromReferenceContext;
function _getOrCreateRefContext(contextName) {
    return __asyncGenerator(this, arguments, function* _getOrCreateRefContext_1() {
        const graph = (0, graphservice_1.getGraph)();
        let context = yield __await(graph.getContext(contextName));
        if (!context) {
            context = new spinal_model_graph_1.SpinalContext(contextName, contextName.replace('.', ''));
            yield __await(graph.addContext(context));
        }
        (0, graphservice_1.addNodeGraphService)(context);
        while (true)
            yield yield __await(context);
    });
}
function getOrCreateRefContext(contextName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dicoContextRef.has(contextName)) {
            const gen = _getOrCreateRefContext(contextName);
            dicoContextRef.set(contextName, gen);
        }
        return (yield dicoContextRef.get(contextName).next()).value;
    });
}
exports.getOrCreateRefContext = getOrCreateRefContext;
function addContextToReference(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof context !== 'undefined') {
            yield context.map(constants_1.GEOGRAPHIC_RELATIONS, (node) => {
                (0, graphservice_1.addNodeGraphService)(node);
                return addToReferenceContext(node);
            });
        }
    });
}
exports.addContextToReference = addContextToReference;
//# sourceMappingURL=geoServiceV2.js.map