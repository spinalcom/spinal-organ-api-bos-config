"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalSet = exports.SpinalNodePointer = exports.SpinalMap = exports.SpinalRelationRef = exports.SpinalRelationPtrLst = exports.SpinalRelationLstPtr = exports.SPINAL_RELATION_TYPE = exports.SPINAL_RELATION_PTR_LST_TYPE = exports.SPINAL_RELATION_LST_PTR_TYPE = exports.SpinalRelationFactory = exports.SpinalNode = exports.DEFAULT_FIND_PREDICATE = exports.SpinalGraph = exports.SpinalContext = exports.REMOVE_CHILD_EVENT = exports.REMOVE_CHILDREN_EVENT = exports.ADD_CHILD_IN_CONTEXT_EVENT = exports.ADD_CHILD_EVENT = void 0;
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
var constants_1 = require("./constants");
Object.defineProperty(exports, "ADD_CHILD_EVENT", { enumerable: true, get: function () { return constants_1.ADD_CHILD_EVENT; } });
Object.defineProperty(exports, "ADD_CHILD_IN_CONTEXT_EVENT", { enumerable: true, get: function () { return constants_1.ADD_CHILD_IN_CONTEXT_EVENT; } });
Object.defineProperty(exports, "REMOVE_CHILDREN_EVENT", { enumerable: true, get: function () { return constants_1.REMOVE_CHILDREN_EVENT; } });
Object.defineProperty(exports, "REMOVE_CHILD_EVENT", { enumerable: true, get: function () { return constants_1.REMOVE_CHILD_EVENT; } });
var SpinalContext_1 = require("./Nodes/SpinalContext");
Object.defineProperty(exports, "SpinalContext", { enumerable: true, get: function () { return SpinalContext_1.SpinalContext; } });
var SpinalGraph_1 = require("./Nodes/SpinalGraph");
Object.defineProperty(exports, "SpinalGraph", { enumerable: true, get: function () { return SpinalGraph_1.SpinalGraph; } });
var SpinalNode_1 = require("./Nodes/SpinalNode");
Object.defineProperty(exports, "DEFAULT_FIND_PREDICATE", { enumerable: true, get: function () { return SpinalNode_1.DEFAULT_FIND_PREDICATE; } });
Object.defineProperty(exports, "SpinalNode", { enumerable: true, get: function () { return SpinalNode_1.SpinalNode; } });
var SpinalRelationFactory_1 = require("./Relations/SpinalRelationFactory");
Object.defineProperty(exports, "SpinalRelationFactory", { enumerable: true, get: function () { return SpinalRelationFactory_1.SpinalRelationFactory; } });
Object.defineProperty(exports, "SPINAL_RELATION_LST_PTR_TYPE", { enumerable: true, get: function () { return SpinalRelationFactory_1.SPINAL_RELATION_LST_PTR_TYPE; } });
Object.defineProperty(exports, "SPINAL_RELATION_PTR_LST_TYPE", { enumerable: true, get: function () { return SpinalRelationFactory_1.SPINAL_RELATION_PTR_LST_TYPE; } });
Object.defineProperty(exports, "SPINAL_RELATION_TYPE", { enumerable: true, get: function () { return SpinalRelationFactory_1.SPINAL_RELATION_TYPE; } });
var SpinalRelationLstPtr_1 = require("./Relations/SpinalRelationLstPtr");
Object.defineProperty(exports, "SpinalRelationLstPtr", { enumerable: true, get: function () { return SpinalRelationLstPtr_1.SpinalRelationLstPtr; } });
var SpinalRelationPtrLst_1 = require("./Relations/SpinalRelationPtrLst");
Object.defineProperty(exports, "SpinalRelationPtrLst", { enumerable: true, get: function () { return SpinalRelationPtrLst_1.SpinalRelationPtrLst; } });
var SpinalRelationRef_1 = require("./Relations/SpinalRelationRef");
Object.defineProperty(exports, "SpinalRelationRef", { enumerable: true, get: function () { return SpinalRelationRef_1.SpinalRelationRef; } });
var SpinalMap_1 = require("./SpinalMap");
Object.defineProperty(exports, "SpinalMap", { enumerable: true, get: function () { return SpinalMap_1.SpinalMap; } });
var SpinalNodePointer_1 = require("./SpinalNodePointer");
Object.defineProperty(exports, "SpinalNodePointer", { enumerable: true, get: function () { return SpinalNodePointer_1.SpinalNodePointer; } });
var SpinalSet_1 = require("./SpinalSet");
Object.defineProperty(exports, "SpinalSet", { enumerable: true, get: function () { return SpinalSet_1.SpinalSet; } });
//# sourceMappingURL=index.js.map